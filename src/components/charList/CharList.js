import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
  const [charAll, setCharAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();
  const itemRefs = useRef([]);

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharAllLoading();
    marvelService.getAllCharacter(offset).then(onCharAllLoaded).catch(onError);
  };

  const onCharAllLoading = () => {
    setNewItemLoading(true);
  };

  const onCharAllLoaded = (newCharAll) => {
    let ended = false;
    if (newCharAll.length < 9) {
      ended = true;
    }

    setCharAll((charAll) => [...charAll, ...newCharAll]);
    setLoading((loading) => false);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const onError = () => {
    setLoading((loading) => false);
    setError(true);
  };

  const focusOnChar = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    itemRefs.current[id].classList.add('char__item_selected');
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error) ? (
    <RenderItem
      charAll={charAll}
      onCharSelected={props.onCharSelected}
      focusOnChar={focusOnChar}
      itemRefs={itemRefs}
    />
  ) : null;
  const spinner = loading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      <ul className="char__grid">{content}</ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const RenderItem = ({ charAll, onCharSelected, focusOnChar, itemRefs }) => {
  return charAll.map((item, i) => {
    const notFoundImg = item.thumbnail.includes('image_not_available')
      ? 'fill'
      : 'cover';

    return (
      <li
        ref={(el) => (itemRefs.current[i] = el)}
        className="char__item"
        key={item.id}
        onClick={() => {
          onCharSelected(item.id);
          focusOnChar(i);
        }}
      >
        <img
          src={item.thumbnail}
          alt={item.name}
          style={{ objectFit: notFoundImg }}
        />
        <div className="char__name">{item.name}</div>
      </li>
    );
  });
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
