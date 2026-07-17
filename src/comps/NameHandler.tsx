import heroImg from '../104473.jpg' // Assuming this is still your image path

function NameHandler({ name }: { name: string }) {
  return (
    <div className="card-header text-start">
      <img src={heroImg} alt="Profile"
        className='img-fluid rounded-circle m-2' 
        style={{ width: '48px', height: '48px', objectFit: 'cover' }} 
      />
      {name}
    </div>
  )
}

export default NameHandler;