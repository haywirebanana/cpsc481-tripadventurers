export default function PhoneFrame({ children }) {
  const borderSize = 12; // px

  return (
    <div
      style={{
        width: "var(--phone-width)",
        height: "var(--phone-height)",
        border: `${borderSize}px solid black`,
        borderRadius: "var(--phone-radius)",
        overflow: "hidden",
        margin: "0 auto",
        boxSizing: "border-box",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
    </div>
  );
}
