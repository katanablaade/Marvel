import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    charAll: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  marvelService = new MarvelService();
  itemRefs = [];

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharAllLoading();
    this.marvelService
      .getAllCharacter(offset)
      .then(this.onCharAllLoaded)
      .catch(this.onError);
  };

  onCharAllLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onCharAllLoaded = (newCharAll) => {
    let ended = false;
    if (newCharAll.length < 9) {
      ended = true;
    }

    this.setState(({ offset, charAll }) => ({
      charAll: [...charAll, ...newCharAll],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  focusOnChar = (id) => {
    this.itemRefs.forEach((item) =>
      item.classList.remove('char__item_selected')
    );
    this.itemRefs[id].classList.add('char__item_selected');
  };

  render() {
    const { charAll, loading, error, offset, newItemLoading, charEnded } =
      this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error) ? (
      <View
        charAll={charAll}
        onCharSelected={this.props.onCharSelected}
        setRef={this.setRef}
        focusOnChar={this.focusOnChar}
        itemRefs={this.itemRefs}
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
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charAll, onCharSelected, setRef, focusOnChar }) => {
  return charAll.map((item, i) => {
    const notFoundImg = item.thumbnail.includes('image_not_available')
      ? 'fill'
      : 'cover';

    return (
      <li
        ref={setRef}
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
