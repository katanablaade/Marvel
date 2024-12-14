import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
  state = {
    charAll: [],
    loading: true,
    error: false,
    hover: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  onCharAllLoaded = (charAll) => {
    this.setState({ charAll, loading: false });
  };
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  updateChar = () => {
    this.marvelService
      .getAllCharacter()
      .then(this.onCharAllLoaded)
      .catch(this.onError);
  };

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  render() {
    const { charAll, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const content = !(loading || error) ? <View charAll={charAll} /> : null;
    const spinner = loading ? <Spinner /> : null;

    return (
      <div className="char__list">
        {spinner}
        {errorMessage}
        <ul className="char__grid">{content}</ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charAll }) => {
  // char__item_selected

  return charAll.map((item) => {
    const notFoundImg = item.thumbnail.includes('image_not_available')
      ? 'fill'
      : 'cover';

    return (
      <li key={item.id} className="char__item">
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

export default CharList;
