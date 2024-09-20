import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
 
  bscTestnet
  
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Canimal ICO Project',
  projectId: '9a2b0518bb808db21a8fb105f0bb8d4b',
  chains: [
    bscTestnet
  ],
  ssr: true,
});
