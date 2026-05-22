import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

/***************************  COLLECTION - DATA  ***************************/

const translateCollection = [
  { name: 'Title', english: 'The main heading of a section or page.', spanish: 'El encabezado principal de una sección o página.' },
  { name: 'Menu', english: 'A list of links for site navigation.', spanish: 'Una lista de enlaces para la navegación del sitio.' },
  { name: 'Navigation', english: 'Helps users move through a site or app.', spanish: 'Ayuda a los usuarios a moverse por un sitio o app.' },
  { name: 'Content', english: 'Text, images, or media displayed on a page.', spanish: 'Texto, imágenes o medios mostrados en una página.' },
  { name: 'Footer', english: 'The bottom section with links or info.', spanish: 'La sección inferior con enlaces o información.' },
  { name: 'Contact', english: 'A section to reach support or inquiries.', spanish: 'Una sección para soporte o consultas.' },
  { name: 'Settings', english: 'Options to customize preferences.', spanish: 'Opciones para personalizar preferencias.' },
  { name: 'About', english: 'Details about a company or individual.', spanish: 'Detalles sobre una empresa o persona.' },
  { name: 'Products', english: 'Items available for sale or use.', spanish: 'Artículos disponibles para venta o uso.' },
  { name: 'Services', english: 'Work or assistance offered to customers.', spanish: 'Trabajo o ayuda ofrecida a clientes.' },
  { name: 'FAQ', english: 'Common questions with answers.', spanish: 'Preguntas comunes con respuestas.' }
];

/***************************  TRANSLATE - COLLECTION  ***************************/

export default function Translate({ language }) {
  return (
    <PageAnimateWrapper>
      <MainCard sx={{ p: 0 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="translate table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '24%' }}></TableCell>
                <TableCell sx={{ width: '38%' }}>
                  <Typography variant="caption1">Default</Typography>
                </TableCell>
                <TableCell sx={{ width: '38%' }}>
                  <Typography variant="caption1" sx={{ textTransform: 'capitalize' }}>
                    {language}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {translateCollection.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" sx={{ p: 3.325 }}>
                    <Typography variant="body2" color="text.secondary">
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      {row.english}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={row.spanish}
                      slotProps={{ input: { sx: { color: 'text.disabled' } } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </PageAnimateWrapper>
  );
}

Translate.propTypes = { language: PropTypes.string };
