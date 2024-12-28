import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
  const [charAll, setCharAll] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const { loading, error, getAllCharacter } = useMarvelService();
  const itemRefs = useRef([]);

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacter(offset).then(onCharAllLoaded);
  };

  const onCharAllLoaded = (newCharAll) => {
    let ended = false;
    if (newCharAll.length < 9) {
      ended = true;
    }

    setCharAll((charAll) => [...charAll, ...newCharAll]);
    setNewItemLoading((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const focusOnChar = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    itemRefs.current[id].classList.add('char__item_selected');
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      {spinner}
      {errorMessage}
      <ul className="char__grid">
        <RenderItem
          charAll={charAll}
          onCharSelected={props.onCharSelected}
          focusOnChar={focusOnChar}
          itemRefs={itemRefs}
        />
      </ul>
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
