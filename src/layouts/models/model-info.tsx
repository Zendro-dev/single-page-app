import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Accordion } from '@/components/containers';

interface ModelInfoProps {
  model: {
    id?: string;
    name?: string;
    request?: string;
  };
}

export default function ModelInfo({
  model,
}: ModelInfoProps): React.ReactElement {
  const modelInfo = [];
  if (model.name) modelInfo.push({ label: 'model', value: model.name });
  if (model.request) modelInfo.push({ label: 'request', value: model.request });
  if (model.id) modelInfo.push({ label: 'record', value: model.id });

  return (
    <Accordion label="Information" text="Click to expand">
      <List>
        {modelInfo.map(({ label, value }) => (
          <ListItem key={label} dense>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="button"
                    fontWeight="bold"
                    color="GrayText"
                  >
                    {label}
                  </Typography>
                  <Typography fontSize="large" fontWeight="bold" marginLeft={4}>
                    {value}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Accordion>
  );
}
