import React from 'react';

function HeaderButton(props) {
    return (
        <div className="action-icons hm-active-action-icon" data-balloon="{props.name}" data-balloon-pos="up" onClick={props.onClick}>
            {props.icon}<i className="{props.icon}"></i>
        </div>
    );
}

export default HeaderButton;
  