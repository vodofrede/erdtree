"use client";

import { changeSort, resetAll, setAll, update } from "./script";

export default function Weapons() {
    return (
        <div>
            <header>
                <h1>Weapon Finder</h1>
            </header>
            <main>
                <div className="app">
                    {/* <!-- parameters --> */}
                    <article style={{ flexBasis: "15%" }}>
                        <div>
                            <b>Parameters</b>
                            <button
                                onClick={resetAll}
                                style={{ marginBottom: "0px" }}
                            >
                                Reset All
                            </button>
                        </div>
                        <hr />
                        <div>
                            <label htmlFor="str">Strength</label>
                            <input
                                id="str"
                                type="number"
                                name="stat"
                                value="10"
                                min="0"
                                max="99"
                                onChange={update}
                            />
                        </div>
                        <div>
                            <label htmlFor="dex">Dexterity</label>
                            <input
                                id="dex"
                                type="number"
                                name="stat"
                                value="10"
                                min="0"
                                max="99"
                                onChange={update}
                            />
                        </div>
                        <div>
                            <label htmlFor="int">Intelligence</label>
                            <input
                                id="int"
                                type="number"
                                name="stat"
                                value="10"
                                min="0"
                                max="99"
                                onChange={update}
                            />
                        </div>
                        <div>
                            <label htmlFor="fth">Faith</label>
                            <input
                                id="fth"
                                type="number"
                                name="stat"
                                value="10"
                                min="0"
                                max="99"
                                onChange={update}
                            />
                        </div>
                        <div>
                            <label htmlFor="arc">Arcane</label>
                            <input
                                id="arc"
                                type="number"
                                name="stat"
                                value="10"
                                min="0"
                                max="99"
                                onChange={update}
                            />
                        </div>
                        <hr />
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="max-upgrade"
                                    name="upgrade-level"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="max-upgrade">
                                    Reinforced (+10 or +25)
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="min-upgrade"
                                    name="upgrade-level"
                                    onChange={update}
                                />
                                <label htmlFor="min-upgrade">
                                    Not Reinforced (+0)
                                </label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <span>
                                <input
                                    id="requirements"
                                    type="checkbox"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="requirements">
                                    Requirements Met
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="buffable"
                                    onChange={update}
                                />
                                <label htmlFor="buffable">Buffable Only</label>
                            </span>
                        </div>
                        <hr />
                        <b>Handedness</b>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="2h-never"
                                    name="handedness"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="2h-never">One-handing</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="2h-sometimes"
                                    name="handedness"
                                    onChange={update}
                                />
                                <label htmlFor="2h-sometimes">
                                    Usable One-handed
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="2h-always"
                                    type="radio"
                                    name="handedness"
                                    onChange={update}
                                    // name="two-handing"
                                />
                                <label htmlFor="2h-always">Two-handing</label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Infusions</b>
                            <span>
                                <button
                                    onClick={() => setAll("infusion", true)}
                                >
                                    Any
                                </button>
                                <button
                                    onClick={() => setAll("infusion", false)}
                                >
                                    None
                                </button>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="standard-infusion"
                                    value="standard"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="standard-infusion">
                                    Standard
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="heavy-infusion"
                                    value="heavy"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="heavy-infusion">Heavy</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="keen-infusion"
                                    value="keen"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="keen-infusion">Keen</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="quality-infusion"
                                    value="quality"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="quality-infusion">
                                    Quality
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="fire-infusion"
                                    value="fire"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="fire-infusion">Fire</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="flame-art-infusion"
                                    value="flame-art"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="flame-art-infusion">
                                    Flame Art
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="lightning-infusion"
                                    value="lightning"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="lightning-infusion">
                                    Lightning
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="sacred-infusion"
                                    value="sacred"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="sacred-infusion">Sacred</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="magic-infusion"
                                    value="magic"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="magic-infusion">Magic</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="occult-infusion"
                                    value="occult"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="occult-infusion">Occult</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="cold-infusion"
                                    value="cold"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="cold-infusion">Cold</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="poison-infusion"
                                    value="poison"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="poison-infusion">Poison</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="blood-infusion"
                                    value="blood"
                                    type="checkbox"
                                    name="infusion"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="blood-infusion">Blood</label>
                            </span>
                        </div>
                        <hr />
                        {/* <!-- damage types --> */}
                        <b>Damage Types</b>
                        <div>
                            <span>
                                <input
                                    id="physical-type"
                                    type="checkbox"
                                    name="damage-type"
                                    disabled
                                />
                                <label htmlFor="physical-type">
                                    Physical Damage
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="magic-type"
                                    type="checkbox"
                                    name="damage-type"
                                    disabled
                                />
                                <label htmlFor="magic-type">Magic Damage</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="fire-type"
                                    type="checkbox"
                                    name="damage-type"
                                    disabled
                                />
                                <label htmlFor="fire-type">Fire Damage</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="lightning-type"
                                    type="checkbox"
                                    name="damage-type"
                                    disabled
                                />
                                <label htmlFor="lightning-type">
                                    Lightning Damage
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="holy-type"
                                    type="checkbox"
                                    name="damage-type"
                                    disabled
                                />
                                <label htmlFor="holy-type">Holy Damage</label>
                            </span>
                        </div>
                    </article>
                    {/* <!-- results --> */}
                    <article style={{ flexBasis: "55%" }}>
                        <b>Damage</b>
                        <template id="weapon">
                            <tr>
                                <td>
                                    <a target="_blank"></a>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </template>
                        <div style={{ overflow: "auto" }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: "2rem" }}>
                                            <b style={{ userSelect: "none" }}>
                                                Weapon
                                            </b>
                                        </th>
                                        <th>
                                            <b
                                                onClick={() =>
                                                    changeSort("max")
                                                }
                                                onMouseOver={(event) =>
                                                    (event.currentTarget.style.cursor =
                                                        "pointer")
                                                }
                                                style={{ userSelect: "none" }}
                                            >
                                                {" "}
                                                Max{" "}
                                            </b>
                                        </th>
                                        <th id="standard">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/standard.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Standard"
                                                alt="Standard"
                                                onClick={() =>
                                                    changeSort("standard")
                                                }
                                            />
                                        </th>
                                        <th id="heavy">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/heavy.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Heavy"
                                                alt="Heavy"
                                                onClick={() =>
                                                    changeSort("heavy")
                                                }
                                            />
                                        </th>
                                        <th id="keen">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/keen.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Keen"
                                                alt="Keen"
                                                onClick={() =>
                                                    changeSort("keen")
                                                }
                                            />
                                        </th>
                                        <th id="quality">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/quality.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Quality"
                                                alt="Quality"
                                                onClick={() =>
                                                    changeSort("quality")
                                                }
                                            />
                                        </th>
                                        <th id="fire">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/fire.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Fire"
                                                alt="Fire"
                                                onClick={() =>
                                                    changeSort("fire")
                                                }
                                            />
                                        </th>
                                        <th id="flame-art">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/flame-art.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Flame Art"
                                                alt="Flame Art"
                                                onClick={() =>
                                                    changeSort("flame-art")
                                                }
                                            />
                                        </th>
                                        <th id="lightning">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/lightning.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Lightning"
                                                alt="Lightning"
                                                onClick={() =>
                                                    changeSort("lightning")
                                                }
                                            />
                                        </th>
                                        <th id="sacred">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/sacred.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Sacred"
                                                alt="Sacred"
                                                onClick={() =>
                                                    changeSort("sacred")
                                                }
                                            />
                                        </th>
                                        <th id="magic">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/magic.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Magic"
                                                alt="Magic"
                                                onClick={() =>
                                                    changeSort("magic")
                                                }
                                            />
                                        </th>
                                        <th id="cold">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/cold.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Cold"
                                                alt="Cold"
                                                onClick={() =>
                                                    changeSort("cold")
                                                }
                                            />
                                        </th>
                                        <th id="poison">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/poison.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Poison"
                                                alt="Poison"
                                                onClick={() =>
                                                    changeSort("poison")
                                                }
                                            />
                                        </th>
                                        <th id="blood">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/blood.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Blood"
                                                alt="Blood"
                                                onClick={() =>
                                                    changeSort("blood")
                                                }
                                            />
                                        </th>
                                        <th id="occult">
                                            <input
                                                name="damage-result"
                                                type="image"
                                                src="/resource/icon/occult.jpg"
                                                style={{ maxWidth: "20px" }}
                                                title="Occult"
                                                alt="Occult"
                                                onClick={() =>
                                                    changeSort("occult")
                                                }
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="weapons"></tbody>
                            </table>
                        </div>
                    </article>
                    {/* <!-- categories --> */}
                    <article style={{ flexBasis: "15%" }}>
                        <div>
                            <b>Categories</b>
                            <span>
                                <button
                                    onClick={() => setAll("category", true)}
                                >
                                    Any
                                </button>
                                <button
                                    onClick={() => setAll("category", false)}
                                >
                                    None
                                </button>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Weapons</b>
                            <span>
                                <button onClick={() => setAll("weapon", true)}>
                                    Any
                                </button>
                                <button onClick={() => setAll("weapon", false)}>
                                    None
                                </button>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="dagger"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="dagger">Daggers</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="straight-sword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="straight-sword">
                                    Straight Swords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="greatsword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="greatsword">Greatswords</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="colossal-sword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="colossal-sword">
                                    Colossal Swords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="thrusting-sword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="thrusting-sword">
                                    Thrusting Swords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="heavy-thrusting-sword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="heavy-thrusting-sword">
                                    Heavy Thrusting Swords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="curved-sword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="curved-sword">
                                    Curved Swords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="curved-greatsword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="curved-greatsword">
                                    Curved Greatswords
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="katana"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="katana">Katanas</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="twinblade"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="twinblade">Twinblades</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="hammer"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="hammer">Hammers</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="great-hammer"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="great-hammer">
                                    Great Hammers
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="flail"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="flail">Flails</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="axe"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="axe">Axes</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="greataxe"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="greataxe">Greataxes</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="spear"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="spear">Spears</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="great-spear"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="great-spear">
                                    Great Spears
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="halberd"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="halberd">Halberds</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="scythe"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="scythe">Scythes</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="whip"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="whip">Whips</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="fist"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="fist">Fists</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="claw"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="claw">Claws</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="colossal-weapon"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="colossal-weapon">
                                    Colossal Weapons
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="torch"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="torch">Torches</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="thrusting-shield"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="thrusting-shield">
                                    Thrusting Shield
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="hand-to-hand-arts"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="hand-to-hand-art">
                                    Hand-to-hand Arts
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="throwing-blade"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="throwing-blade">
                                    Throwing Blades
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="backhand-blade"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="backhand-blade">
                                    Backhand Blades
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="perfume-bottle"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="perfume-bottle">
                                    Perfume Bottles
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="beast-claw"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="beast-claw">Beast Claws</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="light-greatsword"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="light-greatsword">
                                    Light Greatsword
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="great-katana"
                                    name="category"
                                    className="weapon"
                                    onChange={update}
                                    checked
                                />
                                <label htmlFor="great-katana">
                                    Great Katana
                                </label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Ranged</b>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="light-bow"
                                    name="category"
                                />
                                <label htmlFor="light-bow">Light Bows</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="bow"
                                    name="category"
                                />
                                <label htmlFor="bow">Bows</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="greatbow"
                                    name="category"
                                />
                                <label htmlFor="greatbow">Greatbows</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="crossbow"
                                    name="category"
                                />
                                <label htmlFor="crossbow">Crossbows</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="ballistas"
                                    name="category"
                                />
                                <label htmlFor="ballistas">Ballistas</label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Shields</b>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="small-shield"
                                    name="category"
                                />
                                <label htmlFor="small-shield">
                                    Small Shields
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="medium-shield"
                                    name="category"
                                />
                                <label htmlFor="medium-shield">
                                    Medium Shields
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="greatshield"
                                    name="category"
                                />
                                <label htmlFor="greatshield">
                                    Greatshields
                                </label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Catalysts</b>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="glintstone-staff"
                                    name="category"
                                />
                                <label htmlFor="glintstone-staff">
                                    Glintstone Staves
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="sacred-seal"
                                    name="category"
                                />
                                <label htmlFor="sacred-seal">
                                    Sacred Seals
                                </label>
                            </span>
                        </div>
                    </article>
                </div>
                <div>
                    <h2 style={{ textAlign: "center" }}>Notes</h2>
                    <p>
                        Click the headers in the table to sort the table based
                        that column.
                    </p>
                    <p>You can choose between three modes of handedness:</p>
                    <ol>
                        <li>
                            One-handed: Calculates damage and requirements based
                            on one-handed use
                        </li>
                        <li>
                            {" "}
                            Usable one-handed: Calculates damage based on
                            two-handed use, but accounts for weapon being usable
                            one-handed as well{" "}
                        </li>
                        <li>Two-handed: Self-explanatory</li>
                    </ol>
                    <p>
                        {" "}
                        This calculator currently doesn't take auxiliary damage
                        procs (cold, bleed, scarlet rot and poison) into
                        account. Therefore, it won't be very useful for finding
                        weapons to use in a bleed build.{" "}
                    </p>
                    <p>
                        {" "}
                        Catalysts (sacred seals and glintstone staffs) will show
                        their <em>attack rating</em>, not their{" "}
                        <em>spell scaling</em>.{" "}
                    </p>
                    <p>
                        {" "}
                        The same holds true for shields, which are also sorted
                        based on <em>attack rating</em>
                    </p>
                </div>
            </main>
        </div>
    );
}
