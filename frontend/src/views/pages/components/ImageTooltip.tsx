import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import copyText from 'utility/helper/copyText';

export interface ImageTooltip {
  message: string | JSX.Element;
  id: string;
  image: string;
  imageTooltip?: string;
}

export const ImageTooltip: React.FC<ImageTooltip> = (props) => {
  const { message, id, imageTooltip, image } = props;
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (document.getElementById(id)) {
      setReady(true);
    }
  }, [document.getElementById(id)]);

  return (
    <>
      <div className="cursor-pointer" onClick={() => copyText(message)} id={id}>
        <img style={{ width: 30 }} src={image + ''} />
        {message}
      </div>
      {ready && (
        <UncontrolledTooltip
          style={{ width: '300px' }}
          placement="left"
          target={id}
        >
          <img
            style={{ width: '100%', height: '100%' }}
            src={imageTooltip ? imageTooltip : image + ''}
          />
          {message}
        </UncontrolledTooltip>
      )}
    </>
  );
};
