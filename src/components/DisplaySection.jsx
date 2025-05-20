import React from 'react'

function DisplaySection({triggerpreview}) {
    const handleTop = () => {
        const element = document.querySelector('.jumbotron-section');
        window.scrollTo({top: 0 , left: 0 , behavior: 'smooth'});

    }
  return (
    <div className='display-section wrapper'>

    </div>
  )
}

export default DisplaySection
