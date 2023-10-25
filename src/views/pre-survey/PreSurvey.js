
import { Alert, Box, Button, Typography, } from "@mui/material";
import pre_survey from '../../assets/pre-survey.json';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Quiz from "../../components/Quiz";
import { useViewContext } from "../../App";

export default function PreSurvey() {
    const [page, setPage] = React.useState(1)
    const quizData = React.useMemo(() => pre_survey[page - 1], [page]);
    const [{data}, {setView}] = useViewContext();

    return (
            <Box
                width="100%"
                mx="auto"
            >
                <Typography 
                    variant="h4" 
                    align="center" 
                >Information personnelle</Typography>
                <Content
                    quizData={quizData}
                    page={page}
                    key={page}
                />
                <Stack 
                    spacing={2} 
                    sx={{mt: 3}}>
                    <Pagination 
                        count={pre_survey.length}
                        sx={{
                            width: '100%',
                            justifyContent: 'center',
                            display: 'flex',
                        }} 
                        color="primary" 
                        page={page}
                        onChange={(event, page) => {
                            const responses = Object.values(data.current.preSurvey).slice(0, page);
                            console.log(responses);
                            if(
                                responses.every(response => response) && 
                                (responses.length === page - 1 || responses.length === page)
                            )
                                setPage(page);
                            else alert('Remplir les assertion avant de continuer');
                        }}
                    />
                </Stack>
            </Box>
    );
}

const Content = ({quizData, page}) => {
    const [{data}, {setView}] = useViewContext();
    const [response, setResponse] = React.useState({
        id: quizData?.id,
        value: data.current?.preSurvey[quizData?.id],
    });

    return (
        <>
            <Quiz
                {...quizData}
                response={response}
                onChange={(id, value) => {
                    setResponse({id, value});
                    data.current.preSurvey[id] = value;
                }}
            />
            {page === 5 &&
            <Button
                sx={{
                    my:1
                }}
                variant="contained"
                fullWidth
                onClick={() => {
                    data.current.survey = response?.value?.split('_et_').map( key => ({
                        vendeur: 'seller',
                        acheteur: 'buyer'
                    }[key]));
                    setView('survey');
                }}
                disabled={!response?.value}
            > J'ai fini de remplir mes informations personnelles
            </Button>}
        </>
    );
}