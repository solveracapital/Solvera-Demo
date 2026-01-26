import { useState, useMemo } from 'react';

export type GrowthScenario = 'bear' | 'base' | 'bull';

export interface SimulationParams {
    tokenizedEquity: number; // 5-40%
    issuanceCostTokenized: number; // e.g., 3%
    growthScenario: GrowthScenario;
    exitHorizon: number; // 3-7 years
}

export interface SimulationResult {
    currentValuation: number;
    exitValuation: number;
    tokenized: {
        investorCost: number;
        exitValue: number;
        netIRR: number;
        netProfit: number;
        issuanceCostAmount: number;
    };
    charts: {
        year: number;
        tokenizedValue: number;
        liquidity: number;
        volume: number;
    }[];
}

const GROWTH_RATES = {
    bear: 0.10,
    base: 0.18,
    bull: 0.28,
};

const INITIAL_VALUATION = 100_000_000; // IDR 100M

export const useSimulation = () => {
    const [params, setParams] = useState<SimulationParams>({
        tokenizedEquity: 20,
        issuanceCostTokenized: 3,
        growthScenario: 'base',
        exitHorizon: 5,
    });

    const results = useMemo<SimulationResult>(() => {
        const { tokenizedEquity, issuanceCostTokenized, growthScenario, exitHorizon } = params;

        const growthRate = GROWTH_RATES[growthScenario];
        const equityFraction = tokenizedEquity / 100;

        // Base investment value (Equity value)
        const baseInvestment = INITIAL_VALUATION * equityFraction;

        const tokCostAmount = baseInvestment * (issuanceCostTokenized / 100);
        const tokTotalInvested = baseInvestment + tokCostAmount;

        // Exit Value Calculation
        const exitValuation = INITIAL_VALUATION * Math.pow(1 + growthRate, exitHorizon);
        const investorExitValue = exitValuation * equityFraction;

        // IRR Calculation
        const tokIRR = Math.pow(investorExitValue / tokTotalInvested, 1 / exitHorizon) - 1;

        // Chart generation
        const charts = Array.from({ length: exitHorizon + 1 }, (_, i) => {
            const yearValuation = INITIAL_VALUATION * Math.pow(1 + growthRate, i);
            const yearEquityValue = yearValuation * equityFraction;

            // Simulate Liquidity (0-100 score) increasing over time
            // Base liquidity starts low, grows with ecosystem maturity
            const liquidityBase = 20 + (i * 12);
            const liquidity = Math.min(100, liquidityBase + (Math.random() * 10 - 5));

            // Simulate Volume (IDR)
            // Volume typically correlates with value and adoption
            const velocity = 0.05 + (i * 0.02); // 5% turnover growing to higher
            const volume = yearEquityValue * velocity;

            return {
                year: i,
                tokenizedValue: yearEquityValue,
                liquidity: Math.round(liquidity),
                volume: Math.round(volume),
            };
        });

        return {
            currentValuation: INITIAL_VALUATION,
            exitValuation,
            tokenized: {
                investorCost: tokTotalInvested,
                exitValue: investorExitValue,
                netIRR: tokIRR,
                netProfit: investorExitValue - tokTotalInvested,
                issuanceCostAmount: tokCostAmount,
            },
            charts,
        };
    }, [params]);

    return { params, setParams, results };
};
