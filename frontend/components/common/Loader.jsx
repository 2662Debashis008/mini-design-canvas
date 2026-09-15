export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
