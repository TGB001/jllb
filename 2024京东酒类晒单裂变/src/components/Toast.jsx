/* eslint-disable react/react-in-jsx-scope */
/* eslint no-undef: "off"*/

export default class Toast extends React.PureComponent {
    render() {
      const { text } = this.props;
      return (
        text !== '' ? 
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              zIndex: 99999
            }}>
            <span
              style={{
                background: 'black',
                fontSize: 15,
                width: 150,
                opacity: .6,
                textAlign: 'center',
                borderRadius: 5,
                padding: 5
              }}>{text}</span>
          </div> : null
      );
    }
  } 