import React, { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { heartOutline, heart } from "ionicons/icons";

const LikeButton = () => {
    const [liked, setLiked] = useState(false);

    const handleLikeToggle = () => {
        setLiked(!liked);
    };

    return (
        <IonButton
            color={liked ? "danger" : "medium"}
            fill="clear"
            onClick={handleLikeToggle}
        >
            <IonIcon slot="icon-only" size="large" icon={liked ? heart : heartOutline} />
        </IonButton>
    );
};

export default LikeButton;
