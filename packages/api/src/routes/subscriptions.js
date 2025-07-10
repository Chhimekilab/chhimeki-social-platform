const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { generateDigest, processSubscriptions, getDigestRecommendations } = require('../services/digestService');
const router = express.Router();

// Get user's subscriptions
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const subscriptions = await req.db.query(
      'SELECT * FROM get_user_subscriptions($1)',
      [userId]
    );
    
    res.json({
      success: true,
      data: subscriptions.rows
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
});

// Create new subscription
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topicId, topicName, frequency = 'weekly' } = req.body;
    
    if (!topicId || !topicName) {
      return res.status(400).json({
        success: false,
        message: 'Topic ID and name are required'
      });
    }
    
    // Calculate next digest time
    const nextDigestAt = new Date();
    switch (frequency) {
      case 'daily':
        nextDigestAt.setHours(nextDigestAt.getHours() + 24);
        break;
      case 'weekly':
        nextDigestAt.setDate(nextDigestAt.getDate() + 7);
        break;
      case 'monthly':
        nextDigestAt.setMonth(nextDigestAt.getMonth() + 1);
        break;
    }
    
    const result = await req.db.query(
      `INSERT INTO subscriptions (user_id, topic_id, topic_name, frequency, next_digest_at) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (user_id, topic_id) 
       DO UPDATE SET 
         frequency = EXCLUDED.frequency,
         enabled = true,
         next_digest_at = EXCLUDED.next_digest_at,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, topicId, topicName, frequency, nextDigestAt]
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription'
    });
  }
});

// Update subscription
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;
    const { frequency, enabled } = req.body;
    
    // Calculate next digest time if frequency changed
    let nextDigestAt = null;
    if (frequency) {
      nextDigestAt = new Date();
      switch (frequency) {
        case 'daily':
          nextDigestAt.setHours(nextDigestAt.getHours() + 24);
          break;
        case 'weekly':
          nextDigestAt.setDate(nextDigestAt.getDate() + 7);
          break;
        case 'monthly':
          nextDigestAt.setMonth(nextDigestAt.getMonth() + 1);
          break;
      }
    }
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (frequency) {
      updateFields.push(`frequency = $${paramIndex++}`);
      values.push(frequency);
    }
    
    if (enabled !== undefined) {
      updateFields.push(`enabled = $${paramIndex++}`);
      values.push(enabled);
    }
    
    if (nextDigestAt) {
      updateFields.push(`next_digest_at = $${paramIndex++}`);
      values.push(nextDigestAt);
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(subscriptionId, userId);
    
    const result = await req.db.query(
      `UPDATE subscriptions 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

// Delete subscription
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;
    
    const result = await req.db.query(
      'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *',
      [subscriptionId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscription'
    });
  }
});

// Generate digest for specific subscription
router.post('/:id/digest', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionId = req.params.id;
    
    // Get subscription details
    const subscription = await req.db.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, userId]
    );
    
    if (subscription.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }
    
    const sub = subscription.rows[0];
    
    // Generate digest using the service
    const digest = await generateDigest(sub.topic_id, sub.frequency);
    
    // Save digest to database
    const savedDigest = await req.db.query(
      `INSERT INTO digests (
        subscription_id, user_id, topic_id, topic_name, frequency,
        ai_summary, key_insights, trending_topics, news_items, reading_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        subscriptionId,
        userId,
        digest.topicId,
        digest.topicName,
        digest.frequency,
        digest.aiSummary,
        JSON.stringify(digest.keyInsights),
        JSON.stringify(digest.trending),
        JSON.stringify(digest.newsItems),
        digest.readingTime
      ]
    );
    
    // Update subscription's last digest time
    await req.db.query(
      'SELECT update_digest_schedule($1, $2)',
      [subscriptionId, sub.frequency]
    );
    
    res.json({
      success: true,
      data: {
        ...digest,
        id: savedDigest.rows[0].id
      }
    });
  } catch (error) {
    console.error('Error generating digest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate digest'
    });
  }
});

// Get user's digest history
router.get('/digests', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const digests = await req.db.query(
      `SELECT d.*, s.topic_name 
       FROM digests d
       JOIN subscriptions s ON d.subscription_id = s.id
       WHERE d.user_id = $1 
       ORDER BY d.generated_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    
    res.json({
      success: true,
      data: digests.rows
    });
  } catch (error) {
    console.error('Error fetching digest history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch digest history'
    });
  }
});

// Get digest recommendations
router.get('/recommendations', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recommendations = await req.db.query(
      'SELECT * FROM get_digest_recommendations($1)',
      [userId]
    );
    
    res.json({
      success: true,
      data: recommendations.rows
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
});

// Mark digest as viewed
router.post('/digests/:id/view', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const digestId = req.params.id;
    
    // Update digest viewed status
    await req.db.query(
      'UPDATE digests SET viewed_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2',
      [digestId, userId]
    );
    
    // Record interaction
    await req.db.query(
      'INSERT INTO digest_interactions (digest_id, user_id, interaction_type) VALUES ($1, $2, $3)',
      [digestId, userId, 'view']
    );
    
    res.json({
      success: true,
      message: 'Digest marked as viewed'
    });
  } catch (error) {
    console.error('Error marking digest as viewed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark digest as viewed'
    });
  }
});

// Save/unsave digest
router.post('/digests/:id/save', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const digestId = req.params.id;
    const { saved = true } = req.body;
    
    // Update digest saved status
    await req.db.query(
      'UPDATE digests SET saved = $1 WHERE id = $2 AND user_id = $3',
      [saved, digestId, userId]
    );
    
    // Record interaction
    await req.db.query(
      'INSERT INTO digest_interactions (digest_id, user_id, interaction_type) VALUES ($1, $2, $3)',
      [digestId, userId, saved ? 'save' : 'unsave']
    );
    
    res.json({
      success: true,
      message: saved ? 'Digest saved' : 'Digest unsaved'
    });
  } catch (error) {
    console.error('Error saving digest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save digest'
    });
  }
});

// Get available topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await req.db.query(
      'SELECT * FROM topics WHERE enabled = true ORDER BY name'
    );
    
    res.json({
      success: true,
      data: topics.rows
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics'
    });
  }
});

module.exports = router;