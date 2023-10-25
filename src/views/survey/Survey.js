
import { Box, Button, Typography, } from "@mui/material";
import seller from '../../assets/vendeurs.json';
import buyer from '../../assets/acheteurs.json';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Quiz from "../../components/Quiz";
import { useViewContext } from "../../App";
import { useState } from "react";
import { useMemo } from "react";
import ConsentContract from "./ConsentContract";
import Thanks from "./Thanks";

export default function Survey() {
    const [step, setStep] = useState(0);
    const [page, setPage] = React.useState(1);
    const [{data}] = useViewContext();
    const surveyType = useMemo(() => data.current.survey[step], [step, data]);
    const ended = useMemo(() => data.current.survey.length -1 === step, [step, data]);
    const quizData = React.useMemo(() => ({seller, buyer})[surveyType][page - 1], [page, surveyType]);
    const length = useMemo(() => ({seller, buyer})[surveyType].length, [surveyType]);


    return (
        <>
            <Box
                width="100%"
                mx="auto"
            >
                <Typography 
                    variant="h4" 
                    align="center" 
                >
                    {
                    surveyType === 'seller' ?
                    "Pratiques commerciales pour la vente en ligne: Vendeur":
                    "Habitudes d'achat en ligne et expérience de consommation: Acheteur"
                    }
                </Typography>
                <Content
                    quizData={quizData}
                    page={page}
                    key={page}
                    setStep={setStep}
                    setPage={setPage}
                    step={step}
                    ended={ended}
                    surveyType={surveyType}
                    refQuiz={({seller, buyer})[surveyType]?.find(({id}) => id === quizData.link)}
                />
                <Stack 
                    spacing={2} 
                    sx={{mt: 3}}>
                    <Pagination 
                        count={length}
                        sx={{
                            width: '100%',
                            justifyContent: 'center',
                            display: 'flex',
                        }} 
                        color="primary" 
                        page={page}
                        onChange={(event, page) => {
                            const responses = Object.values(data.current[surveyType]).slice(0, page);
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
        </>
            
    );
}

const Content = ({quizData, page, setStep, setPage, ended, surveyType, refQuiz, step}) => {
    const [{data}, {setView}] = useViewContext();
    const [dialog, setDialog] = useState('');
    const [response, setResponse] = React.useState({
        id: quizData?.id,
        value: data.current[surveyType][quizData?.id],
    });

    return (
        <>
            <Quiz
                {...quizData}
                response={response}
                data={data.current[surveyType]}
                refQuiz={refQuiz}
                showPrevious={true}
                onPrevious={() => {
                    if(step > 0) {
                        setStep(0);
                        setPage(10);
                    } else { 
                        setView('pre-survey');
                        setPage(5)
                    }
                }}
                onChange={(id, value) => {
                    setResponse({id, value});
                    data.current[surveyType][id] = value;
                }}
            />
            {page === 10 &&
            <Button
                sx={{ my:1}}
                variant="contained"
                fullWidth
                onClick={() => {
                   if(ended) {
                    setDialog('consent');
                   } else {
                    setPage(1)
                    setStep(step => step + 1);
                   }
                }}
                disabled={!response?.value}
            > J'ai fini de remplir les informations sur mes {
            surveyType ?
            "pratiques commerciales pour la vente en ligne" :
            "habitudes d'achat en ligne et expérience de consommation"
            }
            </Button>}
            <ConsentContract
                open={dialog === 'consent'}
                onClose={() => setDialog(null)}
                setDialog={setDialog}
            />
            <Thanks
                open={dialog === 'thanks'}
                onClose={() => setDialog(null)}
                setDialog={setDialog}
            />
        </>
    );
}