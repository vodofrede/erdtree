"use client";

import { init, resetAll, update } from "./script";

export default function Armor() {
    return (
        <html>
            <body onLoad={() => init()}>
                <header>
                    <h1>Armor Optimizer</h1>
                </header>
                <main>
                    <div className="app">
                        {/* <!-- settings --> */}
                        <article style={{ flexBasis: "25%" }}>
                            <b>Settings</b>
                            <hr />
                            <div>
                                <label htmlFor="max-equip-load">
                                    Max. Equip Load
                                </label>
                                <input
                                    style={{ maxWidth: "50px" }}
                                    className="stat"
                                    id="max-equip-load"
                                    type="number"
                                    onChange={() => update()}
                                    min="0"
                                    step="0.1"
                                    value="30"
                                    name="equip-load"
                                    lang="en"
                                />
                            </div>
                            <div>
                                <label htmlFor="current-equip-load">
                                    Current Equip Load
                                </label>
                                <input
                                    style={{ maxWidth: "50px" }}
                                    className="stat"
                                    id="current-equip-load"
                                    type="number"
                                    onChange={() => update()}
                                    min="0"
                                    step="0.1"
                                    value="0"
                                    name="equip-load"
                                    lang="en"
                                />
                            </div>
                            <div>
                                <label htmlFor="equip-load-budget">
                                    Equip Load Budget
                                </label>
                                <input
                                    style={{ maxWidth: "50px" }}
                                    className="stat"
                                    id="equip-load-budget"
                                    type="number"
                                    value="0"
                                    name="equip-load"
                                    lang="en"
                                    disabled
                                />
                            </div>
                            <hr />
                            <b>Breakpoints</b>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="fast-roll"
                                        onClick={() => update()}
                                        name="roll-type"
                                        value="0.3"
                                    />
                                    <label htmlFor="fast-roll">
                                        Fast Roll (up to 30% equip load)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="normal-roll"
                                        onClick={() => update()}
                                        name="roll-type"
                                        value="0.7"
                                        checked
                                    />
                                    <label htmlFor="normal-roll">
                                        Normal Roll (up to 70% equip load)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="fat-roll"
                                        onClick={() => update()}
                                        name="roll-type"
                                        value="1.0"
                                    />
                                    <label htmlFor="fat-roll">
                                        Fat Roll (up to 100% equip load)
                                    </label>
                                </div>
                            </div>
                            <hr />
                            <b>Sort by</b>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-average"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-average">
                                        Greatest Average Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-standard"
                                        name="sorting-order"
                                        onClick={() => update()}
                                        checked
                                    />
                                    <label htmlFor="sort-standard">
                                        Greatest Standard (Physical, Strike,
                                        Slash, Pierce) Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-physical"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-physical">
                                        Greatest Physical Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-strike"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-strike">
                                        Greatest Strike Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-slash"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-slash">
                                        Greatest Slash Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-pierce"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-pierce">
                                        Greatest Pierce Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-elemental"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-elemental">
                                        Greatest Elemental (Magic, Fire,
                                        Lightning, Holy) Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-magic"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-magic">
                                        Greatest Magic Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-fire"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-fire">
                                        Greatest Fire Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-lightning"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-lightning">
                                        Greatest Lightning Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-holy"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-holy">
                                        Greatest Holy Absorption
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-resistances"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-resistances">
                                        Greatest Resistances
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-scarlet-rot"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-scarlet-rot">
                                        Greatest Scarlet Rot Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-poison"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-poison">
                                        Greatest Poison Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-hemorrhage"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-hemorrhage">
                                        Greatest Hemorrhage Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-frostbite"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-frostbite">
                                        Greatest Frostbite Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-sleep"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-sleep">
                                        Greatest Sleep Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-madness"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-madness">
                                        Greatest Madness Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-death"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-death">
                                        Greatest Death Resistance
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="radio"
                                        id="sort-poise"
                                        name="sorting-order"
                                        onClick={() => update()}
                                    />
                                    <label htmlFor="sort-poise">
                                        Greatest Poise
                                    </label>
                                </div>
                            </div>
                            <hr />
                            <b>Extras</b>
                            <div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="winged-crystal-tear"
                                        onChange={() => update()}
                                        disabled
                                    />
                                    <label htmlFor="winged-crystal-tear">
                                        Winged Crystal Tear (in mixed physick)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <input
                                        type="checkbox"
                                        id="fashion"
                                        onChange={() => update()}
                                        disabled
                                    />
                                    <label htmlFor="fashion">
                                        Fashion Mode
                                    </label>
                                </div>
                            </div>
                            <hr />
                            <b>Locked Armor</b>
                            <template id="locked-option">
                                <option value="">Placeholder</option>
                            </template>
                            <div>
                                <label htmlFor="locked-helmet">Helmet</label>
                                <select
                                    itemType="text"
                                    id="locked-helmet"
                                    name="locked-items"
                                    onChange={() => update()}
                                >
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="locked-chestpiece">
                                    Chestpiece
                                </label>
                                <select
                                    itemType="text"
                                    id="locked-chestpiece"
                                    name="locked-items"
                                    onChange={() => update()}
                                >
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="locked-gauntlets">
                                    Gauntlets
                                </label>
                                <select
                                    itemType="text"
                                    id="locked-gauntlets"
                                    name="locked-items"
                                    onChange={() => update()}
                                >
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="locked-leggings">
                                    Leggings
                                </label>
                                <select
                                    itemType="text"
                                    id="locked-leggings"
                                    name="locked-items"
                                    onChange={() => update()}
                                >
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <div>
                                <button
                                    id="clear-equipment"
                                    onClick={() => resetAll()}
                                >
                                    Reset All
                                </button>
                            </div>
                            <hr />
                            <b>Ignored Armor</b>
                            <div>
                                <ul id="ignored-items"></ul>
                            </div>
                        </article>
                        {/* <!-- sort --> */}
                        <article
                            style={{ flexBasis: "60%", minWidth: "320px" }}
                        >
                            <b>Results</b>
                            <div>
                                <table id="results"></table>
                            </div>
                            <template id="result">
                                <thead>
                                    <tr>
                                        <th>Armor</th>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Total</th>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <th>Absorption</th>
                                        <th>Resistances</th>
                                    </tr>
                                </tbody>
                            </template>
                        </article>
                    </div>
                </main>
            </body>
        </html>
    );
}
