import React from 'react';

function FaqPlayer(props) {
    return (
        <video id="faq-video" className="faq-player" playsInline={true} data-matomo-title={props.faq.question} autoPlay={true}>
            <source src={`./assets/videos/${props.faq.video}`} type="video/mp4" />
            <source src={`./assets/videos/${props.faq.video}`} type="video/ogg" />
            <track src={`./assets/data/${props.faq.subtitles}`} kind="subtitles" srcLang="en" label="English" default={props.subtitles} />
        </video>
    )
}

export default FaqPlayer;