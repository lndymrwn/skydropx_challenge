import { useHistory, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import FavoriteHeart from "../FavoriteHeart";
import './ShowItem.css';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : 'rgba(255,255,255, 0.8)',
    width                 : "500px",
    borderRadius          : '25px'
  }
};

Modal.setAppElement('#root')

function ShowsItem({ item }) {
  const [details, setDetails] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  let history = useHistory();
  let { id } = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setIsFavorite(getIsFavorite())
  }, [])

  useEffect(() => {
    if (+id === item.id) {
      axios.get(`https://api.themoviedb.org/3/tv/${item.id}?api_key=9187861de4b69a7a0899826a4bdf2f74`)
      .then((response) => {
        setDetails(response.data)
      })
    }
  }, [id])

  function openModal() {
    setIsOpen(true);
  }
  function closeModal(){
    setIsOpen(false);
  }

  const handleClick = () => {
    history.push(`/show/${item.id}`);
    openModal();
  }

  const handleFavorite = () => {
    if (isFavorite) {
      localStorage.removeItem(item.id);
      setIsFavorite(false);
    } else {
      localStorage.setItem(item.id, true);
      setIsFavorite(true);
    }
  }

  const getIsFavorite = () => {
    return !!localStorage.getItem(item.id)
  }

  return (
    <Fragment>
      <div className="showCard" onClick={handleClick}>
        <div className="showHeader">
          <h3 className="title">{item.name}</h3>
          <FavoriteHeart isFavorite={isFavorite} onFavorite={handleFavorite}/>
        </div>
        <div><img height="250px" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}?api_key=9187861de4b69a7a0899826a4bdf2f74`} alt="" /></div>
        <div className="average"> Rating: {item.vote_average }</div>
      </div>
      
      <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal">
        <div>
        <button className='btn' onClick={closeModal}>X</button>
        <h1 className="title">{item.name}</h1>
        <div className="average">Rating: {item.vote_average}</div>
        <div><img height="250px" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}?api_key=9187861de4b69a7a0899826a4bdf2f74`} alt="" /></div>
        <div>
          <p>{details?.overview}</p>
          <div>
          Genre: {details?.genres?.map((genre) => {
            return <div>{genre.name}</div>
          })}
          Run Time: {details?.episode_run_time && details.episode_run_time[0]}
            </div>    
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}

export default ShowsItem