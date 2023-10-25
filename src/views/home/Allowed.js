import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useEffect, useMemo, useState } from 'react'
import { FormControl, FormHelperText, Fade, IconButton, InputLabel, FilledInput, InputAdornment, Typography, FormControlLabel, Checkbox, Alert, AlertTitle, Backdrop, CircularProgress } from '@mui/material'
import verifyNumber from '../../utils/verifyNumber'
import ClearIcon from '@mui/icons-material/Clear';
import { SERVER_URL, useViewContext } from '../../App'
import getGeolocation from '../../utils/geo'
import useAxios from 'axios-hooks'

export default function Allowed({open, onClose}) {
    const [allowedGeoLoCation, setAllowedGeoLoCation] = useState(false);
    const [allowedAddNum, setAllowedAddNum] = useState(false);
    const [{data}, {setView}] = useViewContext();
    const [nums, setNums] = useState(['Numéro téléphone 1']);

    const [{loading}, refetch] = useAxios({
        url: '/check',
        manual: true,
        baseURL: SERVER_URL,
        method: 'POST',
    }, {manual: true});

    const onVerify = (cond, index) => cond ? (allow, num) => {
        setAllowedAddNum(allow);
        if(allow)
            data.current.numbers[index] = num;
        else delete data.current.numbers[index];
    } : null;

    return (
        <>
            <Dialog 
                open={Boolean(open)} 
                onClose={onClose}
            >
            <DialogTitle>
                Démarrer l'enquête
            </DialogTitle>
            <DialogContent>
                Veuillez entrer correctement votre numéro de téléphone. 
                Si vous en avez plusieurs, vous pouvez les saisir un par un en cliquant sur <Typography component="span" fontStyle="bold" variant="button">"Ajouter un autre numéro de téléphone"</Typography>. 
                Assurez-vous que les numéros saisis n'ont pas déjà participé à cette enquête.
                <DialogContentText component="div">
                    {
                        nums.map((label, index) => (
                            <InputPhoneNumber
                                key={label}
                                label={label}
                                deleted={Boolean(index)}
                                onVerify={onVerify(nums.length - 1 === index, index)}
                                disabled={nums.length - 1 !== index}
                                oldNum={index ? data.current.numbers[index - 1] : ''}
                                onDeleteNum={() => {
                                    setNums(nums.slice(0, -1));
                                    setAllowedAddNum(true);
                                }}
                            />
                        ))
                    }
                    <Button
                        onClick={() => {
                            setNums(nums => nums.concat(`Numéro téléphone ${nums.length + 1}`));
                            setAllowedAddNum(false)
                        }}
                        disabled={!allowedAddNum}
                    >
                        Ajouter un autre numéro de téléphone
                    </Button>

                    <AllowGeoLocation
                        onAllowedChange={(allowed) => {
                            setAllowedGeoLoCation(allowed)
                        }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                onClick={onClose}
                color="primary"
                >
                Annuler
                </Button>
                <Button
                onClick={() => {
                    refetch({
                        data: {
                            numbers: data.current.numbers,
                        }
                    }).then((result => {
                        if(result.data?.data) 
                            alert('Le numéro de portable spécifié a déjà participé à cette enquête. Veuillez essayer avec un autre numéro');
                        else  setView('pre-survey');

                    })).catch((error) => {
                        alert(error.toString());
                    });
                }}
                variant="contained"
                disabled={!allowedGeoLoCation && !allowedAddNum}
                >
                Démarrer
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
    )
}

const InputPhoneNumber = ({onChange, onError, label, onVerify, disabled, oldNum, deleted, onDeleteNum}) => {
    const [error, setError] = useState(false);
    const [verify, setVerify] = useState(false);
    const [checking, setChecking] = useState(false);
    const isError = useMemo(() => checking && error, [checking, error]);
    const [num, setNum] = useState('');

    const handleChange = event =>  {
        const num = event.currentTarget.value;
        setNum(num);
        if(typeof onChange === 'function')
            onChange(num);
        if(verifyNumber(num) && error && oldNum?.trim() !== num?.trim()){ 
            setError(false);
            if(typeof onError === 'function')
                onError(false)
        }
        if((!verifyNumber(num) && !error) || oldNum?.trim() === num?.trim()) {
            setError(true);
            if(typeof onError === 'function')
                onError(true)
        }

        if(/^([0-9]+)$/.test(num)) setChecking(true);

        if(!verify && verifyNumber(num)){ 
            setVerify(true);
            if(typeof onVerify === 'function' && oldNum?.trim() !== num?.trim() )
                onVerify(true, num.trim())
        }
        if((verify && !verifyNumber(num)) || oldNum?.trim() === num?.trim() ){ 
            setVerify(false);
            if(typeof onVerify === 'function')
                onVerify(false, num.trim())
        }
    };

    return (
        <FormControl
            variant="filled"
            sx={{ my: 1 }} 
            color={isError ? 'error' : 'primary'}
            required
            disabled={disabled}
            fullWidth
        >
          <InputLabel component="div" >{label}</InputLabel>
          <FilledInput
            type="tel"
            value={num}
            onChange={handleChange}
            onBlur={() => {
                if(!verifyNumber(num)) setChecking(true);
            }}
            endAdornment={deleted &&
            <InputAdornment position="end">
                <IconButton
                    edge="end"
                    title="Supprimer le numéro"
                    onClick={onDeleteNum}
                    disabled={disabled}
                >
                    <ClearIcon/>
                </IconButton>
            </InputAdornment>
            }
          />
          
            <Fade in={isError} >
                <FormHelperText
                    component="div"
                    sx={{
                        color: 'error.main'
                    }}
                >
                    {
                    num.trim() === '' ? "Entre un numéro de téléphonique" : 
                    oldNum?.trim() === num?.trim() ? 'Ce numéro est déjà inseré' : 
                    'Ce numéro est invalide' 
                    } 
                </FormHelperText>
            </Fade>
        </FormControl>
        
    );
};

const AllowGeoLocation = ({onAllowedChange}) => {
    const [coords, setSetCoords] = useState(null);
    const [state, setState] = useState();
    const [{data}] = useViewContext();

    useEffect(() => {
        navigator.permissions.query({name:'geolocation'}).then(function(result) {
            setState(result.state);
            result.onchange = function() {
                setState(result.state);
            }
        });
    }, [])

    return (
        <>
        <FormControlLabel
            control={
            <Checkbox 
                checked={Boolean(coords)} 
                onChange={async (event, value) => {
                    if(value){ 
                        try {
                            const position = await getGeolocation();
                            let coordinates = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            setSetCoords(coordinates);
                            onAllowedChange(true);
                            data.current.coords = coordinates;
                        } catch (error) {
                            window.alert("Autorisez la géolocalisation pour cette enquête.")
                            setSetCoords(null)
                            onAllowedChange(false);
                        }
                    } else {
                        setSetCoords(null);
                        onAllowedChange(false);
                    }
                }} 
                name="coords" 
                />
            }
            label={`
            Autorisez la géolocalisation pour cette enquête. 
            Cela garantit la cohérence des informations, limitée à Kinshasa uniquement.`}
        />
        {state === "denied" &&
        <Alert severity="warning" sx={{mt: 2}}>
            <AlertTitle>
                Problème de géolocalisation
            </AlertTitle>
            Nous avons identifié un problème de géolocalisation sur votre appareil. 
            Celui-ci ne permet pas l'accès à la fonction de géolocalisation, 
            ce qui vous empêche de répondre à cette enquête. Veuillez vérifier 
            les paramètres de votre appareil et essayer de vous reconnecter au site.
        </Alert>}
        </>
    )
};