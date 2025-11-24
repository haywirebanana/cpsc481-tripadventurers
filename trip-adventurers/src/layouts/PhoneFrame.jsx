import '../styles/PhoneFrame.css';

export default function PhoneFrame({ children }) {
  return (
    <div className="phone-frame-container">
      <div className="phone-frame">
        <div className="phone-content">
          {children}
        </div>
      </div>
    </div>
  );
}