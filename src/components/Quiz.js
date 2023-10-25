import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useCallback, useMemo } from 'react';
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FilledInput from '@mui/material/FilledInput';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import dayjs from 'dayjs';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Quiz ({type, mode, modalities, quiz, description, id, onChange, response, label, link, data, unit, refQuiz, onPrevious, showPrevious}) {
    const [open, setOpen] = useState(false);

    return (
        <Box
            sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
                maxWidth={600}
                sx={{
                    my: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
            <FormControl component="fieldset">
            <Typography component="div" variant="body1" my={1}>{quiz}</Typography>
            <Box 
                direction="row" 
                gap={1}
                display="flex"
            >
                {showPrevious &&
                <Button
                    children="Revoir les questions précédente"
                    startIcon={<ArrowBackIosIcon/>}
                    variant="contained"
                    sx={{my: 1, flex: 1}}
                    onClick={onPrevious}
                />}
                <Button
                    children="Voir l'explication"
                    variant="contained"
                    endIcon={<InfoIcon/>}
                    sx={{my: 1, flex: 1}}
                    onClick={() => {
                        setOpen(true)
                    }}
                />
            </Box>
                
                {type === 'number' && 
                <NumberInput 
                    onChange={onChange}
                    values={response?.value}
                    label={label}
                    id={id}
                    mode={mode}
                    link={link}
                    data={data}
                    unit={unit}
                    refQuiz={refQuiz}
                />}
                {type === 'date' && 
                <DateInput
                    onChange={onChange}
                    id={id}
                    value={response.value}
                    label={label}
                    mode={mode}
                    
                />}
                {type === 'list' && 
                <ListModalities
                    mode={mode}
                    modalities={modalities}
                    onChange={onChange}
                    values={response?.value}
                    label={label}
                    value={response?.value}
                    id={id}
                />
                }
            </FormControl>
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)} 
            >
              <DialogTitle
                
              >
                {quiz}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                <BoldText>
                    {description}
                </BoldText>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpen(false)}
                  color="primary"
                >
                  J'ai compris
                </Button>
              </DialogActions>
            </Dialog>
            </Box>
        </Box>
    );
}

const ListModalities = ({mode, modalities, label, onChange, id, value:_value, values: _values, unit }) => {
    const [values, setValues] = useState(_values || []);
    const [value, setValue] = useState(_value || '');

    const handleChangeValue = useCallback((event, newValue) => {
        const value = typeof newValue === 'string' ? newValue : event.target.value;
        setValue(value);
        if(typeof onChange === 'function') 
            onChange(id, value);
    }, [id, onChange]);

    return (
        <Box
            sx={{my: 1, maxWidth: 600}}
        >
            <FormHelperText>
                {helps[mode]}
            </FormHelperText>
            <FormControl 
                fullWidth 
                variant="filled" 
                sx={{ my: 1 }}
            >
                    
                    {mode === "option" &&
                    <>
                        <InputLabel  id={label}>{label}</InputLabel>
                        <Select
                            id={label}
                            value={value}
                            fullWidth
                            onChange={handleChangeValue}
                            label={label}
                        >
                            {
                                modalities.map(item => (
                                    <MenuItem key={item?.value} value={item?.value}>{item?.label}</MenuItem>
                                ))
                            }
                        </Select>
                    </>}
                    {mode === 'multi' && 
                     <>
                        <FormLabel id={label}>{label}</FormLabel>
                        <FormGroup id={label}>
                            {
                                modalities.map(item => (
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            checked={Boolean(values.find(value => value === item.value))}
                                            onChange={() => {
                                                const newValues = values.find(value => value === item.value) ?
                                                values.filter(value => value !== item.value) :
                                                values.concat([item.value]);
                                                setValues(newValues);
                                                if(typeof onChange === 'function') 
                                                    onChange(id, newValues?.length ? newValues : undefined);
                                            }}
                                        />} 
                                        key={item?.value} 
                                        value={item?.value} 
                                        label={item?.label}
                                    />
                                ))
                            }
                        </FormGroup>
                    </>}
                    {mode === 'mono' &&
                    <>
                        <FormLabel id={label}>{label}</FormLabel>
                        <RadioGroup
                            name="radio-buttons-group"
                            value={value}
                            onChange={handleChangeValue}
                        >
                            {
                                modalities.map(item => (
                                    <FormControlLabel
                                        control={<Radio />} 
                                        key={item?.value} 
                                        value={item?.value} 
                                        label={item?.label}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </>}
            </FormControl>
        </Box>
    )
}

const NumberInput = ({onChange, id, values: _values, link, data, unit, refQuiz, label, value}) => {

   

    const refData = useMemo(() => {
        if(link) {
            return Array.isArray(data[link]) ? data[link].map(label => ({
                unit,
                label: refQuiz?.modalities.find(({value}) => label === value)?.label,
            })) : [{ 
                unit, 
                label: data[link],
            }]
        } else return  [{
            unit,
            label
        }];
    },[data, label, link, refQuiz, unit]);


    const [values, setValue] = useState((Array.isArray(_values) ? _values : (_values && [_values]))  || refData?.map(() => ''));

    return (
        refData.map((input, index) => (
            <FormControl 
                variant="filled" 
                fullWidth
                sx={{ my: 1}}
                key={input?.label || label}
            >
                <InputLabel>{input?.label}</InputLabel>
                <FilledInput
                    endAdornment={input?.unit && <InputAdornment position="end">{input?.unit}</InputAdornment>}
                    type="number"
                    fullWidth
                    label={input?.label}
                    min={0}
                    onChange={(event) => {
                        values[index] = event.target.value;
                        setValue(values);
                        if(typeof onChange === 'function')
                            onChange(id, link ? values : event.target.value);
                    }}
                    inputProps={{
                        type: 'number',
                        min: 0,
                    }}
                    value={values[index]}
                />
            </FormControl>
        ))
    )
}

const DateInput = ({id, onChange, value: _value, label, type, mode})  => {
    const [value, setValue] = useState(_value ? dayjs(_value) : '');

    return (
        <Box sx={{my: 1, maxWidth: 600}}>
            <FormHelperText>
                {helps[mode]}
            </FormHelperText>
            <FormControl 
                fullWidth 
                variant="filled" 
                sx={{ my: 1 }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        value={value} 
                        label={label}
                        maxDate={dayjs("12/31/2007")}
                        minDate={dayjs("12/01/1930")}
                        format="DD/MM/YYYY"
                        onChange={date => {
                            setValue(date);
                            if(typeof onChange === 'function')
                                onChange(id, date.toString());
                        }} 
                    />
                </LocalizationProvider>
            </FormControl>
        </Box>
    )
};

const helps = {
    mono: "Veuillez cliquer sur le bouton correspondant à votre choix. Vous ne pouvez sélectionner qu'une seule option.",
    multi: "Veuillez cocher toutes les options qui s'appliquent à vous. Vous pouvez sélectionner plusieurs options.",
    option: "Veuillez sélectionner une seule option dans la liste qui correspond le mieux à votre réponse. Cliquez sur la liste déroulante pour afficher les options disponibles, puis choisissez celle qui convient.",
    date: "Veuillez cliquer sur le champ de date et utiliser le calendrier ou le sélecteur de date fourni pour choisir la date souhaitée. "
}


function BoldText({ children:text }) {
    const regex = /##(.*?)##/g;
    let parts = text.split(regex);
    for(let i = 1; i < parts.length; i += 2) {
        parts[i] = <strong key={i} >{parts[i]}</strong>;
    }
    return <>{parts}</>;
}