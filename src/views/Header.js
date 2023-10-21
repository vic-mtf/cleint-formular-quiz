import { Box, Divider, Typography } from "@mui/material";
import enetete_esu from '../assets/entete-esu-removebg-preview.png';
import iss_kin from '../assets/logo-iss-removebg-preview.png';

export default function Header() {
  return (
    <>
        <Box
            width="100%"
            display="flex"
            my={2}
            justifyContent="center"
            py={2}
            sx={{
                flexDirection: {
                    xs: 'column',
                    lg: 'row',
                },
                gap: {
                    xs: 2,
                    md: 0,
                },
                height: {
                    xs: 'auto',
                    md: 120,
                },
            }}
        >
            <Box
                display="flex"
                height="90%"
                alignItems="center"
                justifyContent="center"
            >
                <Box 
                    component="img"
                    src={enetete_esu}
                    sx={{
                        height: {
                            xs: 'auto',
                            md: '90%'
                        },
                        width: {
                            xs: '90%',
                            md: 'auto'
                        }
                    }}
                    
                />
            </Box>
            <Box
                display="flex"
                height="90%"
                alignItems="center"
                justifyContent="center"
                flex={1}
            >
                <Box 
                    component="img"
                    src={iss_kin}
                    sx={{
                        height: {
                            xs: 'auto',
                            md: '100%'
                        },
                        width: {
                            xs: '80%',
                            md: 'auto'
                        }
                    }}
                    title="Institut Superieur de Statistique de Kinshasa"
                />
            </Box>
        </Box>
        <Divider/>
        <Typography 
            variant="h3" 
            fontWeight="bold"
            my={1}
            color="primary"
            fontFamily="pristina"
        >
            Enquête iss kin
        </Typography>
    </>
  );
}
