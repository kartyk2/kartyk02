import useRevisionData from "../hooks/useRevisionData";

export default function RevisionMapper() {

  const {
    sessions,
    dueReviews,
    loading,
  } = useRevisionData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-wrap">

      <h1>Revision Mapper</h1>

      <h2>
        Due Reviews ({dueReviews.length})
      </h2>

      <ul>
        {dueReviews.map(review => (
          <li key={review.id}>
            {review.study_sessions?.title}
          </li>
        ))}
      </ul>

      <h2>
        Sessions ({sessions.length})
      </h2>

      <ul>
        {sessions.map(session => (
          <li key={session.id}>
            {session.title}
          </li>
        ))}
      </ul>

    </div>
  );
}