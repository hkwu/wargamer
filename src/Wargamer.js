import WorldOfTanks from './clients/WorldOfTanks';
import WorldOfTanksBlitz from './clients/WorldOfTanksBlitz';
import WorldOfTanksConsole from './clients/WorldOfTanksConsole';
import WorldOfWarships from './clients/WorldOfWarships';
import WorldOfWarplanes from './clients/WorldOfWarplanes';
import Wargaming from './clients/Wargaming';

/**
 * @classdesc The Wargamer client.
 */
class Wargamer {
  /**
   * Constructs a new World of Tanks API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanks} The API client.
   * @static
   */
  static WoT(options) {
    return new WorldOfTanks(options);
  }

  /**
   * Constructs a new World of Tanks Blitz API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanksBlitz} The API client.
   * @static
   */
  static WoTB(options) {
    return new WorldOfTanksBlitz(options);
  }

  /**
   * Constructs a new World of Tanks Console API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfTanksConsole} The API client.
   * @static
   */
  static WoTX(options) {
    return new WorldOfTanksConsole(options);
  }

  /**
   * Constructs a new World of Warships API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfWarships} The API client.
   * @static
   */
  static WoWS(options) {
    return new WorldOfWarships(options);
  }

  /**
   * Constructs a new World of Warplanes API client.
   * @param {ClientOptions} options - The client options.
   * @returns {WorldOfWarplanes} The API client.
   * @static
   */
  static WoWP(options) {
    return new WorldOfWarplanes(options);
  }

  /**
   * Constructs a new Wargaming.net API client.
   * @param {ClientOptions} options - The client options.
   * @returns {Wargaming} The API client.
   * @static
   */
  static WGN(options) {
    return new Wargaming(options);
  }
}

export default Wargamer;
