function TextCardHandler({ currentUser, sender, text }: { currentUser: string; sender: string; text: string }) {
  const isMine = sender === currentUser;
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return (
    <div className={`d-flex mb-2 ${isMine ? 'justify-content-start' : 'justify-content-end'}`}>
      <div
        className={`card shadow-sm ${isMine ? 'text-bg-info' : 'text-bg-success'}`}
        style={{ maxWidth: '75%', wordBreak: 'break-word' }}
      >
        <div className="card-body py-2 px-3">
          <p className="card-text text-start mb-1">{text}</p>
          <small className="d-block text-light">
            {hours}:{minutes} · {sender}
          </small>
        </div>
      </div>
    </div>
  );
}

export default TextCardHandler