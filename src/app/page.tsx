export default function Home() {
    return (
        <div>
            <header>
                <h1>Create, view and optimize builds for Elden Ring.</h1>
            </header>
            <main>
                <div className="cards">
                    <a href="/class">
                        <article>
                            <h2>Starting Class</h2>
                            <span>
                                <p>
                                    Find the optimal starting class for your
                                    build.
                                </p>
                            </span>
                        </article>
                    </a>
                    <a href="/armor">
                        <article>
                            <h2>Armor Optimizer</h2>
                            <span>
                                <p>Maximize defensive stats.</p>
                            </span>
                        </article>
                    </a>
                    <a href="/weapons">
                        <article>
                            <h2>Weapon Finder</h2>
                            <span>
                                <p>Get suggestions for usable weapons.</p>
                            </span>
                        </article>
                    </a>
                    <div>
                        <h3>News</h3>
                        <ul>
                            <li>
                                Up to date for App Ver. 1.14, Calibrations Ver.
                                1.13.2.
                            </li>
                        </ul>
                        <h3>Credits</h3>
                        <p>
                            {" "}
                            Elden Ring images, etc., are property of From
                            Software and BANDAI NAMCO.
                        </p>
                        <p>
                            {" "}
                            This page was heavily inspired by the awesome{" "}
                            <a
                                href="https://mugenmonkey.com"
                                className="highlight"
                            >
                                MugenMonkey
                            </a>{" "}
                            website.{" "}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
