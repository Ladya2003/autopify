import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import carService from '../services/api/carService';

const CarFilter = ({ onFilter }: { onFilter: (filters: any) => void }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await carService.fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const fetchModels = async () => {
        try {
          const data = await carService.fetchModels(selectedBrand);
          setModels(data);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };

      fetchModels();
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  const handleFilter = () => {
    if (priceFrom && priceTo && Number(priceFrom) > Number(priceTo)) {
      alert('Цена от не может быть больше, чем Цена до');
      return;
    }
    onFilter({
      brand: selectedBrand,
      model: selectedModel,
      priceFrom,
      priceTo,
    });
  };

  const handleClear = () => {
    onFilter({});

    setSelectedBrand('');
    setSelectedModel('');
    setPriceFrom('');
    setPriceTo('');
  };

  return (
    <Box sx={{ marginBottom: 3, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            select
            label="Марка"
            variant="outlined"
            fullWidth
            value={selectedBrand}
            disabled={!brands?.length}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            {brands?.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            select
            label="Модель"
            variant="outlined"
            fullWidth
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!models?.length}
          >
            {models?.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            label="Цена от"
            variant="outlined"
            fullWidth
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <TextField
            label="Цена до"
            variant="outlined"
            fullWidth
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4} textAlign="center">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Центрирование кнопок
              gap: 2, // Установка расстояния между кнопками
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ p: 1.5, px: 2 }}
            >
              Фильтровать
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleClear}
              sx={{ p: 1.5, px: 2 }}
            >
              Очистить
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarFilter;
