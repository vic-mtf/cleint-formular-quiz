
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Backdrop, CircularProgress, Checkbox } from "@mui/material";
import useAxios from "axios-hooks";
import * as React from 'react';
import { useState } from "react";
import { SERVER_URL, useViewContext } from "../../App";
import seller from '../../assets/vendeurs.json';
import buyer from '../../assets/acheteurs.json';
import pre_survey from '../../assets/pre-survey.json';

export default function ConsentContract({open, onClose, setDialog}) {
    const [allowed, setAllowed] = useState(false);
    const [{data}] = useViewContext();

    const [{loading}, refetch] = useAxios({
      url: '/save',
      manual: true,
      baseURL: SERVER_URL,
      method: 'POST',
  }, {manual: true});

    return (
        <>
           <Dialog open={open} onClose={onClose} aria-labelledby="consent-contract">
             <DialogTitle id="consent-contract">
                Soumettre vos réponses
             </DialogTitle>
             <DialogContent>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allowed}
                            onChange={() => {
                                setAllowed(value => !value);
                            }}
                        />
                    } 
                    value="consent"
                    label={consent}
                />
             </DialogContent>
             <DialogActions>
               <Button
                 onClick={onClose}
                 color="primary"
               >Annuler
               </Button>
               <Button
                onClick={() =>  {
                  const vendeur = {
                    coords: data.current.coords,
                    numbers: data.current.numbers,
                  };
                  const acheteur = {
                    coords: data.current.coords,
                    numbers: data.current.numbers,
                  };
                  const rowData = {
                    donnee_demographique: {},
                  };
                  
                  if(Object.keys(data.current.seller).length) {
                    rowData.vendeur = vendeur;
                    seller.forEach(({id, key, link}) => {
                      rowData.vendeur[key] = link ? 
                      data.current.seller[id].map((res, index) =>  ({
                        [data.current.seller[link][index]]: res
                      }))  :
                       data.current.seller[id];
                    });
                  }

                  if(Object.keys(data.current.buyer).length) {
                    rowData.acheteur = acheteur;
                    buyer.forEach(({id, key, link}) => {
                      rowData.acheteur[key] = link ? 
                      data.current.buyer[id].map((res, index) =>  ({
                        [data.current.buyer[link][index]]: res
                      }))  :
                       data.current.buyer[id];
                    });
                  }

                  if(Object.keys(data.current.preSurvey).length) {
                    pre_survey.forEach(({id, key, link}) => {
                      rowData.donnee_demographique[key] = link ? 
                      data.current.preSurvey[id].map((res, index) =>  ({
                        [data.current.preSurvey[link][index]]: res
                      }))  :
                       data.current.preSurvey[id];
                    });
                  }
                  refetch({
                    data: {
                        numbers: data.current.numbers,
                        data: rowData,
                    }
                }).then((result => {
                    if(result.data?.data) {
                      setDialog('thanks');
                    }
                })).catch((error) => {
                    alert(error.toString());
                });
                }}
                color="primary"
                disabled={!allowed}
               >Envoyer
               </Button>
             </DialogActions>
           </Dialog>
           <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

const consent = `
Je consens pleinement et de manière éclairée à envoyer les réponses à cette enquête, 
en comprenant parfaitement l'objectif et les implications de ma participation. 
Je suis convaincu(e) de l'importance de contribuer à cette étude et 
j'accepte volontairement de partager mes réponses en toute confiance.`;
