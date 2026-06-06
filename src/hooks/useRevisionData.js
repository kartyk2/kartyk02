// src/hooks/useRevisionData.js

import { useEffect, useState } from "react";

import {
  getSessions,
  getDueReviews,
  createSession,
  completeReview,
} from "../services/revisionApi";

export default function useRevisionData() {
  const [sessions, setSessions] = useState([]);
  const [dueReviews, setDueReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);

      const [sessionsData, reviewsData] =
        await Promise.all([
          getSessions(),
          getDueReviews(),
        ]);

      setSessions(sessionsData || []);
      setDueReviews(reviewsData || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addSession(sessionData) {
    try {
      setError(null);

      const session =
        await createSession(sessionData);

      await refresh();

      return session;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  }

  async function markReviewDone(reviewId) {
    try {
      setError(null);

      await completeReview(reviewId);

      await refresh();
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return {
    loading,
    error,

    sessions,
    dueReviews,

    refresh,

    addSession,
    markReviewDone,
  };
}