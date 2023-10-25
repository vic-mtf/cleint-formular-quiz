
import {Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, } from "@mui/material";
import * as React from 'react';
import { useViewContext } from "../../App";
import { useState } from "react";
import { useMemo } from "react";

export default function Thanks({open, onClose}) {
    const [, {setView}] = useViewContext()

    return (
           <Dialog open={open} onClose={onClose} aria-labelledby="thanks">
             <DialogTitle id="thanks">
                Soumettre vos réponses
             </DialogTitle>
             <DialogContent>
              <DialogContentText>
                  {thanks}
              </DialogContentText>
             </DialogContent>
             <DialogActions>
               <Button
                 onClick={() => {
                  setView('home');
                  onClose();
                }}
                 color="primary"
               >D'accord
               </Button>
             </DialogActions>
           </Dialog>
    );
}

const thanks = `
Nous souhaitons vous remercier du fond du cœur pour votre participation à notre enquête. 
Nous sommes conscients que votre temps est précieux, 
c'est pourquoi nous apprécions d'autant plus que vous ayez pris le temps de répondre à toutes les questions jusqu'au bout. 
Votre contribution est extrêmement précieuse pour nous et nous aidera à mieux comprendre vos besoins et vos préférences.
Nous tenons également à vous informer qu'après traitement et évaluation de toutes les données collectées, nous pourrons vous remercier en vous offrant des crédits allant de 50 unités jusqu'à 200 unités, en fonction de votre niveau de participation.
Encore une fois, merci pour votre engagement et votre soutien. Nous sommes honorés de pouvoir compter sur votre collaboration.
`;
