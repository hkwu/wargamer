import 'dotenv/config';
import { expect } from 'chai';
import Wargamer from '../src/Wargamer';
import WorldOfTanks from '../src/clients/WorldOfTanks';
import WorldOfTanksBlitz from '../src/clients/WorldOfTanksBlitz';
import WorldOfTanksConsole from '../src/clients/WorldOfTanksConsole';
import WorldOfWarships from '../src/clients/WorldOfWarships';
import WorldOfWarplanes from '../src/clients/WorldOfWarplanes';
import Wargaming from '../src/clients/Wargaming';

describe('Wargamer', function() {
  it('correctly constructs clients', function() {
    const options = { realm: 'na', applicationId: process.env.APPLICATION_ID };

    expect(Wargamer.WoT(options)).to.be.instanceof(WorldOfTanks);
    expect(Wargamer.WoTB(options)).to.be.instanceof(WorldOfTanksBlitz);
    expect(Wargamer.WoTC(options)).to.be.instanceof(WorldOfTanksConsole);
    expect(Wargamer.WoWS(options)).to.be.instanceof(WorldOfWarships);
    expect(Wargamer.WoWP(options)).to.be.instanceof(WorldOfWarplanes);
    expect(Wargamer.WGN(options)).to.be.instanceof(Wargaming);
  });
});
