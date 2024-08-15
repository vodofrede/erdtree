"use client";

import { resetAll, update } from "./script";

export default function Class() {
    return (
        <main>
            <div className="app">
                <article>
                    <div>
                        <b>Class</b>
                        <input id="best" type="text" disabled />
                    </div>
                    <hr />
                    <template id="class">
                        <li>
                            <span></span>
                            <aside></aside>
                        </li>
                    </template>
                    <div>
                        <ul id="classes"></ul>
                    </div>
                </article>
                <article>
                    <div>
                        <b>Level</b>
                        <div>
                            <input id="initial-level" type="number" disabled />
                            <input
                                type="number"
                                style={{ visibility: "hidden" }}
                                disabled
                            />
                            <input id="final-level" type="number" disabled />
                            <input id="virtual-level" type="number" disabled />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <label htmlFor="vigor">Vigor</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="vigor"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="mind">Mind</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="mind"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="endurance">Endurance</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="endurance"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="strength">Strength</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="strength"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dexterity">Dexterity</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="dexterity"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="intelligence">Intelligence</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="intelligence"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="faith">Faith</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="faith"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="arcane">Arcane</label>
                        <div>
                            <input type="number" name="initial" disabled />
                            <input
                                id="arcane"
                                type="number"
                                name="total"
                                min="0"
                                max="99"
                                onInput={update}
                            />
                            <input type="number" name="final" disabled />
                            <input type="number" name="virtual" disabled />
                        </div>
                    </div>
                </article>
                <article>
                    <div>
                        <label>
                            <b>Helmet</b>
                        </label>
                        <select id="helmet" name="equipment" onChange={update}>
                            <option id="none" value="none">
                                No Helmet
                            </option>
                        </select>
                    </div>
                    <hr />
                    <div>
                        <b>Talismans</b>
                    </div>
                    <div>
                        <ul id="talismans">
                            <template id="talisman">
                                <li>
                                    <div>
                                        <input
                                            name="talisman"
                                            type="checkbox"
                                            onChange={update}
                                        />
                                        <label></label>
                                    </div>
                                    <aside
                                        style={{ fontSize: "0.8rem" }}
                                    ></aside>
                                </li>
                            </template>
                        </ul>
                    </div>
                    <div>
                        <button onClick={resetAll}>Reset All</button>
                    </div>
                </article>
            </div>
            <div>
                <h2 style={{ textAlign: "center" }}>Explanation & Usage</h2>
                <p>The four columns in the second box represent, in order:</p>
                <ol>
                    <li>
                        Class base stats, e.g. the stats the class has at its
                        base level.
                    </li>
                    <li>
                        {" "}
                        Desired stats. Here, you should input what the absolute
                        minimum stats for your build should be. Leave the input
                        fields blank for stats you don't care about.{" "}
                    </li>
                    <li>
                        Final stats. These are your characters stats as they
                        should appear on your level-up screen.
                    </li>
                    <li>
                        {" "}
                        Virtual stats. These are your characters stats after
                        talismans and helmet stat buffs are applied.{" "}
                    </li>
                </ol>
            </div>
            <div>
                <h2 style={{ textAlign: "center" }}>Softcaps</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Skill</th>
                            <th>Stat</th>
                            <th>Softcaps</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Vigor</td>
                            <td>HP</td>
                            <td>
                                25 (800HP)
                                <br />
                                40 (1450HP)
                                <br />
                                60 (1900HP)
                            </td>
                            <td>
                                A +12 upgraded crimson flask heals for 810HP.
                            </td>
                        </tr>
                        <tr>
                            <td>Mind</td>
                            <td>FP</td>
                            <td>40 (220FP)</td>
                            <td>A +12 upgraded cerulean flask gives 220FP.</td>
                        </tr>
                        <tr>
                            <td>Endurance</td>
                            <td>Stamina</td>
                            <td>
                                30 (125stm.)
                                <br />
                                50 (155stm.)
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Equip Load</td>
                            <td>
                                25 (72 wgt.)
                                <br />
                                60 (120 wgt.)
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Strength</td>
                            <td>AR</td>
                            <td>
                                37 ≃ 55 (2h)
                                <br />
                                54 ≃ 80 (2h)
                                <br />
                                66 ≃ 99 (2h)
                                <br />
                                80
                            </td>
                            <td>2-handing gives you 1.5x strength.</td>
                        </tr>
                        <tr>
                            <td>Dexterity</td>
                            <td>AR</td>
                            <td>55, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Intelligence</td>
                            <td>AR</td>
                            <td>55, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Spell Buff</td>
                            <td>60, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Faith</td>
                            <td>AR</td>
                            <td>55, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Spell Buff</td>
                            <td>60, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Arcane</td>
                            <td>AR</td>
                            <td>55, 80</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Status</td>
                            <td>45, 60</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Spell Buff</td>
                            <td>
                                60, 80 (Pure catalyst)
                                <br />
                                30, 45 (Hybrid catalyst)
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
}
