import './main.css'
import Header from "../../../common/header/header";
import Footer from "../../../common/footer/footer";
import React from "react";

const main = ({user}) => {

    return (
        <>
            <Header user={user}></Header>

            <main>
                <section className="banner">
                    <div className="banner__container">
                        <div className="banner__text-container">
                            <h1 className="banner__title">YOUR GADGETS – OUR CONCERN!</h1>
                            <p className="banner__desc">Is your computer frozen? Cracked screen?
                                No worries – we’ll fix everything quickly and efficiently!</p>
                        </div>
                    </div>
                </section>

                <section className="advantages">
                    <div className="advantages__container">
                        <h2 className="advantages__title">WHY YOU SHOULD CHOOSE US?</h2>
                        <div className="advantages__statistics-container">
                            <div className="statistic__text-area">
                                <span className="statistic__number">2500+</span>
                                <h3 className="statistic__title">Repaired Devices</h3>
                                <p className="statistic__desc">Your gadget is in reliable hands!
                                    We restore phones, laptops, tablets, and other devices, no matter the complexity of the
                                    repair.</p>
                            </div>
                            <div className="statistic__separator"></div>
                            <div className="statistic__text-area">
                                <span className="statistic__number">180</span>
                                <h3 className="statistic__title">Day Repair Warranty</h3>
                                <p className="statistic__desc">We are confident in our work, which is why we provide a
                                    180-day warranty on all types of repair services.
                                    If the issue reoccurs after the repair, we will fix it free of charge.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer></Footer>
        </>
    )
}

export default main;