import React from 'react';
import Button from '../../components/button';
import { getLink } from '../../../utils';
import Icon from '../../components/icon';

const createFooter = (event, type, more) => {
  switch (type) {
    case 'button':
      return (
        <div style={{ textAlign: 'center', marginTop: 80, marginBottom: 20 }}>
          <Button type="normal" link={getLink(event.link)} target={event.target || '_self'}>
            {more}
            <Icon type="arrow" size="7px" />
          </Button>
        </div>
      );
    case 'arrow':
    default:
      return (
        <a className="date-section" href={getLink(event.link)} target={event.target || '_self'}>
          {event.dateStr}
          <img className="arrow" src={getLink('/img/system/arrow_right.png')} />
        </a>
      );
  }
};

class EventCard extends React.Component {
  render() {
    const { event, type, more } = this.props;
    return (
      <div className="event-card">
        <a href={getLink(event.link)} target={event.target || '_self'}>
          <img src={getLink(event.img)} />
        </a>
        <div className="event-introduction">
          <h4>{event.title}</h4>
          <p>{event.content}</p>
          {createFooter(event, type, more)}
        </div>
      </div>
    );
  }
}

export default EventCard;
