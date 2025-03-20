import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/api/client';
import { endpoints } from '../../../services/api/endpoints';
import styles from './ReviewsTab.module.css';

const ReviewsTab = ({ userData }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For business owners - they see reviews for their businesses
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchReviews();
    
    // Fetch businesses if user is a business owner
    if (userData?.role === 'BUSINESS_OWNER') {
      fetchUserBusinesses();
    }
  }, [activeFilter, sortBy, sortOrder, page, selectedBusiness, userData]);

  const fetchUserBusinesses = async () => {
    try {
      const response = await apiClient.get(endpoints.business.list);
      setBusinesses(response.data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    }
  };

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let endpoint = '';
      let params = {
        page,
        limit: 10,
        sort: sortBy,
        order: sortOrder
      };
      
      if (userData?.role === 'ADMIN') {
        // Admin sees all reviews
        endpoint = endpoints.admin.reviews;
      } else if (userData?.role === 'BUSINESS_OWNER') {
        // Business owner sees reviews for their businesses
        endpoint = endpoints.business.reviews;
        if (selectedBusiness !== 'all') {
          params.businessId = selectedBusiness;
        }
      } else {
        // Regular user sees their own reviews
        endpoint = endpoints.user.reviews;
      }
      
      // Add filter parameter
      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }
      
      const response = await apiClient.get(endpoint, { params });
      
      setReviews(response.data.reviews);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page when changing filters
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to first page when changing sort
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    setPage(1); // Reset to first page when changing sort order
  };

  const handleBusinessChange = (e) => {
    setSelectedBusiness(e.target.value);
    setPage(1); // Reset to first page when changing business
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setEditFormData({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleCancelEdit = () => {
    setReviewToEdit(null);
    setEditFormData({
      rating: 0,
      comment: ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiClient.put(`${endpoints.user.reviews}/${reviewToEdit.id}`, editFormData);
      
      // Update the review in the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewToEdit.id ? {
            ...review,
            rating: editFormData.rating,
            comment: editFormData.comment,
            updatedAt: new Date().toISOString()
          } : review
        )
      );
      
      setReviewToEdit(null);
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await apiClient.delete(`${endpoints.user.reviews}/${reviewId}`);
      
      // Remove the review from the local state
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again.');
    }
  };

  // For admin - handle review moderation
  const handleReviewModeration = async (reviewId, action) => {
    try {
      await apiClient.put(`${endpoints.admin.reviewModeration}/${reviewId}`, { action });
      
      // Update the review status in the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId ? {
            ...review,
            status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : review.status
          } : review
        )
      );
    } catch (err) {
      console.error('Error moderating review:', err);
      setError('Failed to moderate review. Please try again.');
    }
  };

  // Render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${styles.star} ${i <= rating ? styles.filled : ''}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Render edit form
  const renderEditForm = () => {
    if (!reviewToEdit) return null;
    
    return (
      <div className={styles.editFormOverlay}>
        <div className={styles.editFormContainer}>
          <h3>Edit Review</h3>
          <form onSubmit={handleSubmitEdit}>
            <div className={styles.formGroup}>
              <label>Rating</label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map(star => (
                  <label key={star} className={styles.ratingLabel}>
                    <input
                      type="radio"
                      name="rating"
                      value={star}
                      checked={editFormData.rating === star}
                      onChange={handleEditFormChange}
                    />
                    <span className={`${styles.star} ${star <= editFormData.rating ? styles.filled : ''}`}>
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="comment">Review</label>
              <textarea
                id="comment"
                name="comment"
                value={editFormData.comment}
                onChange={handleEditFormChange}
                className={styles.textarea}
                rows="4"
                required
              />
            </div>
            
            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsHeader}>
        <h2>Reviews</h2>
        {userData?.role === 'BUSINESS_OWNER' ? (
          <p>Manage and respond to reviews for your business</p>
        ) : userData?.role === 'ADMIN' ? (
          <p>Moderate all user reviews across the platform</p>
        ) : (
          <p>View and manage your submitted reviews</p>
        )}
      </div>
      
      {/* Controls Section */}
      <div className={styles.controlsContainer}>
        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          {userData?.role === 'ADMIN' && (
            <>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'pending' ? styles.active : ''}`}
                onClick={() => handleFilterChange('pending')}
              >
                Pending
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'approved' ? styles.active : ''}`}
                onClick={() => handleFilterChange('approved')}
              >
                Approved
              </button>
              <button 
                className={`${styles.filterButton} ${activeFilter === 'rejected' ? styles.active : ''}`}
                onClick={() => handleFilterChange('rejected')}
              >
                Rejected
              </button>
            </>
          )}
        </div>
        
        <div className={styles.sortContainer}>
          <select 
            value={sortBy} 
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
          </select>
          
          <button 
            className={styles.sortOrderButton}
            onClick={handleSortOrderToggle}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        
        {userData?.role === 'BUSINESS_OWNER' && businesses.length > 0 && (
          <div className={styles.businessSelectContainer}>
            <select
              value={selectedBusiness}
              onChange={handleBusinessChange}
              className={styles.businessSelect}
            >
              <option value="all">All Businesses</option>
              {businesses.map(business => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {/* Reviews List */}
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📝</div>
          <h3>No reviews found</h3>
          <p>
            {activeFilter !== 'all' 
              ? `There are no reviews with the "${activeFilter}" status.` 
              : userData?.role === 'BUSINESS_OWNER' && selectedBusiness !== 'all'
                ? 'No reviews for this business yet.'
                : 'You have not submitted any reviews yet.'}
          </p>
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map(review => (
            <div key={review.id} className={`${styles.reviewCard} ${review.status === 'pending' ? styles.pendingReview : ''}`}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewMeta}>
                  {userData?.role === 'BUSINESS_OWNER' || userData?.role === 'ADMIN' ? (
                    <div className={styles.reviewUser}>
                      <img 
                        src={review.user?.profilePicture || '/assets/default-avatar.png'} 
                        alt={review.user?.name || 'User'} 
                        className={styles.userAvatar}
                        onError={(e) => e.target.src = '/assets/default-avatar.png'}
                      />
                      <span>{review.user?.name || 'Anonymous User'}</span>
                    </div>
                  ) : (
                    <div className={styles.businessInfo}>
                      <img 
                        src={review.business?.logo || '/assets/default-business.png'} 
                        alt={review.business?.name || 'Business'} 
                        className={styles.businessLogo}
                        onError={(e) => e.target.src = '/assets/default-business.png'}
                      />
                      <span>{review.business?.name || 'Unknown Business'}</span>
                    </div>
                  )}
                  <div className={styles.reviewRating}>
                    {renderStarRating(review.rating)}
                  </div>
                </div>
                
                <div className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className={styles.reviewBody}>
                <p>{review.comment}</p>
              </div>
              
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <div className={styles.editedBadge}>
                  Edited on {new Date(review.updatedAt).toLocaleDateString()}
                </div>
              )}
              
              {/* Review status badge for admin */}
              {userData?.role === 'ADMIN' && (
                <div className={`${styles.statusBadge} ${styles[review.status]}`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </div>
              )}
              
              {/* Business owner response */}
              {review.businessResponse && (
                <div className={styles.businessResponse}>
                  <div className={styles.responseHeader}>
                    <strong>Business Response:</strong>
                    <span className={styles.responseDate}>
                      {new Date(review.businessResponse.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{review.businessResponse.content}</p>
                </div>
              )}
              
              <div className={styles.reviewActions}>
                {/* Regular user can edit/delete their own reviews */}
                {userData?.role === 'USER' && (
                  <>
                    <button 
                      className={styles.actionButton}
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                
                {/* Business owner can respond to reviews */}
                {userData?.role === 'BUSINESS_OWNER' && (
                  <button 
                    className={styles.actionButton}
                    onClick={() => {/* Implement response functionality */}}
                  >
                    {review.businessResponse ? 'Edit Response' : 'Respond'}
                  </button>
                )}
                
                {/* Admin can approve/reject reviews */}
                {userData?.role === 'ADMIN' && review.status === 'pending' && (
                  <>
                    <button 
                      className={`${styles.actionButton} ${styles.approveButton}`}
                      onClick={() => handleReviewModeration(review.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.rejectButton}`}
                      onClick={() => handleReviewModeration(review.id, 'reject')}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            &lt; Previous
          </button>
          
          <span className={styles.pageIndicator}>
            Page {page} of {totalPages}
          </span>
          
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next &gt;
          </button>
        </div>
      )}
      
      {/* Edit Review Form Modal */}
      {renderEditForm()}
    </div>
  );
};

export default ReviewsTab;