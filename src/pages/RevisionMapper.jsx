import { useMemo, useState } from "react";
import "./RevisionMapper.css";

const INTERVALS = [7, 30, 45, 60, 90, 180];

const INITIAL_TOPICS = [
  {
    id: "dp",
    title: "Dynamic Programming",
    category: "DSA",
    createdAt: "2026-06-01",
    notes: "LIS, Knapsack, State DP",
    completedReviews: [0],
  },
  {
    id: "rust-ownership",
    title: "Rust Ownership",
    category: "Systems",
    createdAt: "2026-06-03",
    notes: "Ownership, Borrowing, Lifetimes",
    completedReviews: [],
  },
  {
    id: "lora",
    title: "LoRA Fine Tuning",
    category: "ML",
    createdAt: "2026-06-05",
    notes: "Rank decomposition, adapters",
    completedReviews: [],
  },
];

function addDays(dateString, days) {
  const d = new Date(dateString);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RevisionMapper() {
  const [topics, setTopics] = useState(INITIAL_TOPICS);

  const today = new Date();

  const dueTopics = useMemo(() => {
    return topics.filter(topic => {
      return INTERVALS.some((days, idx) => {
        if (topic.completedReviews.includes(idx)) return false;

        const reviewDate = addDays(topic.createdAt, days);

        return (
          reviewDate.toDateString() === today.toDateString() ||
          reviewDate < today
        );
      });
    });
  }, [topics]);

  const markReviewDone = (topicId, reviewIndex) => {
    setTopics(prev =>
      prev.map(topic =>
        topic.id === topicId
          ? {
              ...topic,
              completedReviews: [
                ...new Set([...topic.completedReviews, reviewIndex]),
              ],
            }
          : topic
      )
    );
  };

  const totalReviews = topics.length * INTERVALS.length;

  const completedReviews = topics.reduce(
    (sum, topic) => sum + topic.completedReviews.length,
    0
  );

  const completionPct = Math.round(
    (completedReviews / totalReviews) * 100
  );

  return (
    <div className="page-wrap revision-page">
      <div className="page-head">
        <span className="eyebrow">Knowledge System</span>

        <h1 className="page-title">
          Revision Mapper
        </h1>

        <p className="page-sub">
          Track concepts, schedule reviews, and build
          long-term retention.
        </p>
      </div>

      {/* DASHBOARD */}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Topics</span>
          <strong>{topics.length}</strong>
        </div>

        <div className="stat-card">
          <span>Due Today</span>
          <strong>{dueTopics.length}</strong>
        </div>

        <div className="stat-card">
          <span>Reviews Done</span>
          <strong>{completedReviews}</strong>
        </div>

        <div className="stat-card">
          <span>Progress</span>
          <strong>{completionPct}%</strong>
        </div>
      </div>

      {/* DUE SECTION */}

      <section className="section-card">
        <div className="section-header">
          <h2>Due Revisions</h2>
          <span>{dueTopics.length} pending</span>
        </div>

        {dueTopics.length === 0 ? (
          <p className="empty-state">
            No revisions due today 🎯
          </p>
        ) : (
          <div className="due-grid">
            {dueTopics.map(topic => (
              <div
                key={topic.id}
                className="due-card"
              >
                <span className="category">
                  {topic.category}
                </span>

                <h3>{topic.title}</h3>

                <p>{topic.notes}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* KNOWLEDGE MAP */}

      <section className="section-card">
        <div className="section-header">
          <h2>Knowledge Map</h2>
        </div>

        <div className="topic-list">
          {topics.map(topic => (
            <div
              key={topic.id}
              className="topic-card"
            >
              <div className="topic-top">
                <div>
                  <h3>{topic.title}</h3>
                  <span>{topic.category}</span>
                </div>
              </div>

              <p className="topic-notes">
                {topic.notes}
              </p>

              <div className="timeline">
                {INTERVALS.map((days, idx) => {
                  const reviewed =
                    topic.completedReviews.includes(idx);

                  const reviewDate = addDays(
                    topic.createdAt,
                    days
                  );

                  return (
                    <button
                      key={idx}
                      className={`timeline-node ${
                        reviewed ? "done" : ""
                      }`}
                      onClick={() =>
                        markReviewDone(topic.id, idx)
                      }
                    >
                      <span>{days}d</span>

                      <small>
                        {formatDate(reviewDate)}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}