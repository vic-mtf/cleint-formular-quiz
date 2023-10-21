import { Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from "react";
import Allowed from "./Allowed";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [openStart, setOpenStart] = useState(false);

  return (
    <>
      <Box>
          <Typography 
            color="text.secondary"
          >{texts.home} <Button sx={{textTransform: 'none'}}  onClick={() => setOpen(true)}>Savoir plus</Button>
          </Typography>
        
            <DialogActions>
              <Button
                variant="contained"
                endIcon={<PlayCircleFilledWhiteIcon/>}
                onClick={() => {
                  setOpenStart(true);
                }}
              >
                Commencer
              </Button>
            {Boolean(window.navigator.share) && <Button
                variant="contained"
                endIcon={<ShareIcon/>}
                onClick={() => {
                  window.navigator.share({
                    url: window.location.toString(),
                    title: "Enquête iss kin",
                    text: texts.home,
                  })
                }}
              >
                Partager
              </Button>}
            </DialogActions>
      </Box>
      <Dialog open={open}>
        <DialogTitle >
          Savoir plus
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {texts.iss}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            color="primary"
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <Allowed
        open={openStart}
        onClose={() => setOpenStart(false)}
        key={openStart}
      />
    </>
  );
}

const texts = {
  home: `
  Participez à notre enquête sur le commerce électronique à Kinshasa !
  Nous avons besoin de vos commentaires pour mieux comprendre les défis et les opportunités du commerce électronique dans cette région. Votre expérience en tant que vendeur ou acheteur en ligne est inestimable. Vos commentaires nous aideront à formuler des recommandations pratiques pour améliorer les infrastructures, renforcer la confiance des consommateurs et stimuler le développement du commerce électronique à Kinshasa.
  Rejoignez-nous aujourd'hui et faites entendre votre voix dans le monde du commerce électronique à Kinshasa ! `,
  iss: `
  Enquête Iss kin est un site web qui vous permet de répondre à des 
  enquêtes sur le commerce électronique à Kinshasa, 
  une région dynamique et en pleine croissance. 
  En répondant aux enquêtes, vous contribuez à 
  la recherche sur le commerce électronique dans 
  cette région, et vous aidez les acteurs locaux 
  à améliorer leurs services et leurs offres. 
 
  Vos informations personnelles sont protégées et ne 
  seront jamais divulguées à des tiers. 
  Iss kin respecte les normes éthiques et légales 
  en matière d'enquêtes en ligne. 
`
}
