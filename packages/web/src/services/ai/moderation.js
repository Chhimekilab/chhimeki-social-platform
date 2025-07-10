import { v4 as uuidv4 } from 'uuid';

// Mock moderation categories and their thresholds
const MODERATION_CATEGORIES = {
  'harassment': 0.7,
  'harassment/threatening': 0.8,
  'hate': 0.8,
  'hate/threatening': 0.9,
  'self-harm': 0.9,
  'self-harm/intent': 0.9,
  'self-harm/instructions': 0.9,
  'sexual': 0.7,
  'sexual/minors': 1.0,
  'violence': 0.8,
  'violence/graphic': 0.8,
  'spam': 0.6,
  'toxic': 0.7
};

// Mock flagged content patterns
const FLAGGED_PATTERNS = [
  /\b(hate|stupid|idiot|moron)\b/i,
  /\b(kill|die|death)\b/i,
  /\b(spam|buy now|click here)\b/i,
  /\b(scam|fake|lie)\b/i,
  /(.)\1{10,}/, // Repeated characters
  /[A-Z]{20,}/, // Excessive caps
];

// Positive content indicators
const POSITIVE_PATTERNS = [
  /\b(amazing|great|wonderful|fantastic|awesome|love|thank|appreciate|helpful|brilliant)\b/i,
  /\b(please|thanks|thank you|appreciate|grateful)\b/i,
  /\b(interesting|insightful|thoughtful|valuable|useful)\b/i,
];

/**
 * Simulate OpenAI moderation API call
 */
const simulateOpenAIModerationCall = async (content) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  
  console.log(`🛡️ Moderating content: "${content.substring(0, 50)}..."`);
  
  // In production, this would be:
  // const response = await openai.moderations.create({
  //   input: content,
  // });
  // return response.results[0];
  
  // Return simulated moderation result
  return {
    flagged: false,
    categories: {},
    category_scores: {}
  };
};

/**
 * Analyze content for potential issues
 */
const analyzeContentRisks = (content) => {
  const analysis = {
    flagged: false,
    categories: {},
    category_scores: {},
    confidence: 0.95,
    reasons: []
  };
  
  const lowerContent = content.toLowerCase();
  
  // Check for spam indicators
  const spamScore = Math.min(1.0, (
    (content.match(/!/g) || []).length * 0.1 +
    (content.match(/\$|money|buy|sale/gi) || []).length * 0.2 +
    (content.includes('http') ? 0.3 : 0) +
    (content.length > 500 ? 0.2 : 0)
  ));
  
  // Check for harassment/toxicity
  let harassmentScore = 0;
  FLAGGED_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      harassmentScore += 0.3;
    }
  });
  
  // Check for positive indicators (reduce scores)
  let positiveScore = 0;
  POSITIVE_PATTERNS.forEach(pattern => {
    if (pattern.test(content)) {
      positiveScore += 0.2;
    }
  });
  
  // Apply positive bias
  harassmentScore = Math.max(0, harassmentScore - positiveScore);
  
  // Set category scores
  analysis.category_scores = {
    'harassment': Math.min(0.99, harassmentScore),
    'harassment/threatening': Math.min(0.99, harassmentScore * 0.8),
    'hate': Math.min(0.99, harassmentScore * 0.7),
    'hate/threatening': Math.min(0.99, harassmentScore * 0.6),
    'self-harm': 0.01,
    'self-harm/intent': 0.01,
    'self-harm/instructions': 0.01,
    'sexual': 0.01,
    'sexual/minors': 0.01,
    'violence': Math.min(0.99, harassmentScore * 0.5),
    'violence/graphic': 0.01,
    'spam': Math.min(0.99, spamScore),
    'toxic': Math.min(0.99, (harassmentScore + spamScore) / 2)
  };
  
  // Check if any category exceeds threshold
  Object.entries(MODERATION_CATEGORIES).forEach(([category, threshold]) => {
    const score = analysis.category_scores[category] || 0;
    if (score >= threshold) {
      analysis.flagged = true;
      analysis.categories[category] = true;
      analysis.reasons.push(`${category}: ${(score * 100).toFixed(1)}%`);
    } else {
      analysis.categories[category] = false;
    }
  });
  
  return analysis;
};

/**
 * Moderate content (posts, comments, messages)
 */
export const moderateContent = async (content, contentType = 'comment') => {
  try {
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }
    
    console.log(`🔍 Moderating ${contentType}: "${content.substring(0, 30)}..."`);
    
    // Simulate OpenAI moderation call
    await simulateOpenAIModerationCall(content);
    
    // Perform our own analysis
    const analysis = analyzeContentRisks(content);
    
    // Determine action based on analysis
    let action = 'approve';
    let severity = 'low';
    
    if (analysis.flagged) {
      const maxScore = Math.max(...Object.values(analysis.category_scores));
      
      if (maxScore >= 0.9) {
        action = 'block';
        severity = 'high';
      } else if (maxScore >= 0.8) {
        action = 'flag';
        severity = 'medium';
      } else if (maxScore >= 0.7) {
        action = 'review';
        severity = 'medium';
      } else {
        action = 'flag';
        severity = 'low';
      }
    }
    
    const moderationResult = {
      id: uuidv4(),
      content_type: contentType,
      original_content: content,
      flagged: analysis.flagged,
      action: action,
      severity: severity,
      categories: analysis.categories,
      category_scores: analysis.category_scores,
      confidence: analysis.confidence,
      reasons: analysis.reasons,
      model_used: 'text-moderation-latest',
      processed_at: new Date().toISOString(),
      metadata: {
        content_length: content.length,
        word_count: content.split(' ').length,
        detected_language: 'en' // Simple assumption
      }
    };
    
    console.log(`✅ Moderation complete - Action: ${action}, Flagged: ${analysis.flagged}`);
    
    return moderationResult;
    
  } catch (error) {
    console.error('Error moderating content:', error);
    throw new Error(`Moderation failed: ${error.message}`);
  }
};

/**
 * Moderate comment before posting
 */
export const moderateComment = async (commentData) => {
  try {
    const moderation = await moderateContent(commentData.content, 'comment');
    
    const result = {
      ...commentData,
      moderation: moderation,
      approved: !moderation.flagged,
      requires_review: moderation.action === 'review',
      blocked: moderation.action === 'block'
    };
    
    // Add helpful message for users
    if (moderation.flagged) {
      result.moderationMessage = getModerationMessage(moderation.action, moderation.categories);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error moderating comment:', error);
    return {
      ...commentData,
      approved: false,
      error: 'Moderation service unavailable',
      moderationMessage: 'Unable to verify content safety. Please try again later.'
    };
  }
};

/**
 * Moderate post before publishing
 */
export const moderatePost = async (postData) => {
  try {
    const moderation = await moderateContent(postData.content, 'post');
    
    const result = {
      ...postData,
      moderation: moderation,
      approved: !moderation.flagged,
      requires_review: moderation.action === 'review',
      blocked: moderation.action === 'block'
    };
    
    if (moderation.flagged) {
      result.moderationMessage = getModerationMessage(moderation.action, moderation.categories);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error moderating post:', error);
    return {
      ...postData,
      approved: false,
      error: 'Moderation service unavailable',
      moderationMessage: 'Unable to verify content safety. Please try again later.'
    };
  }
};

/**
 * Batch moderate multiple pieces of content
 */
export const batchModerate = async (contentArray) => {
  try {
    console.log(`📦 Batch moderating ${contentArray.length} items`);
    
    const results = [];
    const batchSize = 5; // Process in batches to avoid overwhelming
    
    for (let i = 0; i < contentArray.length; i += batchSize) {
      const batch = contentArray.slice(i, i + batchSize);
      const batchPromises = batch.map(item => 
        moderateContent(item.content, item.type || 'text')
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < contentArray.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Batch moderation complete: ${results.length} items processed`);
    
    return {
      total: results.length,
      flagged: results.filter(r => r.flagged).length,
      approved: results.filter(r => !r.flagged).length,
      results: results
    };
    
  } catch (error) {
    console.error('Error in batch moderation:', error);
    throw new Error(`Batch moderation failed: ${error.message}`);
  }
};

/**
 * Get user-friendly moderation message
 */
const getModerationMessage = (action, categories) => {
  const flaggedCategories = Object.keys(categories).filter(cat => categories[cat]);
  
  switch (action) {
    case 'block':
      return 'Your content violates our community guidelines and cannot be posted. Please review our policies and try again.';
    
    case 'flag':
      return 'Your content has been flagged for review. It may take some time to appear publicly.';
    
    case 'review':
      if (flaggedCategories.includes('spam')) {
        return 'Your content appears to be promotional. Please ensure it adds value to the discussion.';
      }
      return 'Your content is under review to ensure it meets our community standards.';
    
    default:
      return 'Content approved.';
  }
};

/**
 * Get moderation statistics for analytics
 */
export const getModerationStats = (moderationResults) => {
  const total = moderationResults.length;
  const flagged = moderationResults.filter(r => r.flagged).length;
  const blocked = moderationResults.filter(r => r.action === 'block').length;
  const reviewed = moderationResults.filter(r => r.action === 'review').length;
  
  const categoryStats = {};
  moderationResults.forEach(result => {
    Object.keys(result.categories).forEach(category => {
      if (result.categories[category]) {
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      }
    });
  });
  
  return {
    total,
    flagged,
    blocked,
    reviewed,
    approved: total - flagged,
    flagRate: total > 0 ? (flagged / total * 100).toFixed(2) : 0,
    blockRate: total > 0 ? (blocked / total * 100).toFixed(2) : 0,
    categoryBreakdown: categoryStats,
    topCategories: Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cat, count]) => ({ category: cat, count }))
  };
};

/**
 * Check if content needs human review
 */
export const needsHumanReview = (moderationResult) => {
  return moderationResult.action === 'review' || 
         (moderationResult.flagged && moderationResult.confidence < 0.8);
};

/**
 * Auto-moderate based on user reputation
 */
export const autoModerateWithReputation = async (content, userReputation = 50) => {
  const moderation = await moderateContent(content);
  
  // Adjust thresholds based on user reputation
  const reputationMultiplier = userReputation / 100;
  const adjustedThreshold = 0.7 * (2 - reputationMultiplier); // Higher rep = lower threshold
  
  const maxScore = Math.max(...Object.values(moderation.category_scores));
  
  if (maxScore < adjustedThreshold) {
    moderation.action = 'approve';
    moderation.flagged = false;
  }
  
  moderation.reputation_adjusted = true;
  moderation.user_reputation = userReputation;
  moderation.adjusted_threshold = adjustedThreshold;
  
  return moderation;
};

export default {
  moderateContent,
  moderateComment,
  moderatePost,
  batchModerate,
  getModerationStats,
  needsHumanReview,
  autoModerateWithReputation
};