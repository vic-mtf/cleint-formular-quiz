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
          <DialogContentText component="div">
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
  Nous vous invitons cordialement à participer à notre enquête sur le commerce électronique à Kinshasa. Votre expérience et vos commentaires sont essentiels pour nous aider à comprendre les défis et les opportunités du commerce électronique dans cette région.
En tant que vendeur ou acheteur en ligne, votre point de vue est inestimable. Vos retours nous permettront de formuler des recommandations pratiques pour améliorer les infrastructures, renforcer la confiance des consommateurs et stimuler le développement du commerce électronique à Kinshasa.

Et ce n’est pas tout ! En participant à cette enquête, vous aurez la chance de gagner un crédit allant de 50 à 200 unités. C’est notre façon de vous remercier pour votre temps et votre contribution précieuse.

Rejoignez-nous aujourd’hui et faites entendre votre voix dans le monde du commerce électronique à Kinshasa !

Merci d’avance pour votre participation.`,
  iss: `
  Chers utilisateurs,

Nous sommes ravis de vous présenter **Iss kin**, un site web dédié à la réalisation d'enquêtes sur le commerce électronique à Kinshasa, une région dynamique et en pleine croissance. En participant à nos enquêtes, vous jouez un rôle crucial dans la recherche sur le commerce électronique dans cette région. Vos réponses aideront les acteurs locaux à améliorer leurs services et leurs offres, contribuant ainsi à l'évolution du paysage du commerce électronique à Kinshasa.

Nous comprenons l'importance de la confidentialité et nous nous engageons à protéger vos informations personnelles. Chez Iss kin, nous respectons les normes éthiques et légales en matière d'enquêtes en ligne. Soyez assurés que vos informations personnelles sont protégées et ne seront jamais divulguées à des tiers. Nous utilisons des protocoles de sécurité avancés pour garantir la sécurité de vos données.

En outre, nous tenons à souligner que votre participation est totalement volontaire. Vous avez le droit de retirer votre consentement à tout moment. Cependant, chaque réponse compte et votre contribution est précieuse pour nous.

Nous vous remercions d'avance pour votre temps et votre contribution à cette initiative importante. Ensemble, nous pouvons façonner l'avenir du commerce électronique à Kinshasa.

Merci de faire partie de cette aventure passionnante avec Iss kin.
`
}
