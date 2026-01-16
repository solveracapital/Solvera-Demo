import { useState, useMemo } from 'react';

export type GrowthScenario = 'bear' | 'base' | 'bull';

export interface SimulationParams {
    tokenizedEquity: number; // 5-40%
    issuanceCostTokenized: number; // e.g., 3%
    issuanceCostTraditional: number; // e.g., 8%
    growthScenario: GrowthScenario;
    exitHorizon: number; // 3-7 years
}

export interface SimulationResult {
    currentValuation: number;
    exitValuation: number;
    traditional: {
        investorCost: number;
        exitValue: number;
        netIRR: number;
        netProfit: number;
        issuanceCostAmount: number;
    };
    tokenized: {
        investorCost: number;
        exitValue: number;
        netIRR: number;
        netProfit: number;
        issuanceCostAmount: number;
        liquidityUplift: number; // Efficiency gain
    };
    charts: {
        year: number;
        traditionalValue: number;
        tokenizedValue: number;
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
        issuanceCostTraditional: 8,
        growthScenario: 'base',
        exitHorizon: 5,
    });

    const results = useMemo<SimulationResult>(() => {
        const { tokenizedEquity, issuanceCostTokenized, issuanceCostTraditional, growthScenario, exitHorizon } = params;

        const growthRate = GROWTH_RATES[growthScenario];
        const equityFraction = tokenizedEquity / 100;

        // Base investment value (Equity value)
        const baseInvestment = INITIAL_VALUATION * equityFraction;

        // Costs
        // Assumption: Issuance cost is paid by the raising company, but affects the investor's effective entry or the company's capital efficiency.
        // However, to make it simple for the user comparison:
        // Let's assume the investor pays "Invested Amount" but "Issuance Cost" eats into it or is a fee on top.
        // Let's model it as a fee on top for comparison OR efficiency loss.
        // Prompt says: "Issuance Cost (Traditional 8% vs Tokenized 3%)" and "Net IRR showing the uplift".
        // Let's say: 
        // Traditional: You invest X, but effective value working is X / (1 + cost)? Or cost is sunk.
        // Let's calculate IRR based on: Cash Out (Investment + Fees) vs Cash In (Exit Value).

        const tradCostAmount = baseInvestment * (issuanceCostTraditional / 100);
        const tokCostAmount = baseInvestment * (issuanceCostTokenized / 100);

        const tradTotalInvested = baseInvestment + tradCostAmount; // Sunk cost view
        const tokTotalInvested = baseInvestment + tokCostAmount;

        // Exit Value Calculation
        // Future Value = Present Value * (1 + r)^n
        const exitValuation = INITIAL_VALUATION * Math.pow(1 + growthRate, exitHorizon);
        const investorExitValue = exitValuation * equityFraction;

        // IRR Calculation: (FV / PV)^(1/n) - 1
        const tradIRR = Math.pow(investorExitValue / tradTotalInvested, 1 / exitHorizon) - 1;
        const tokIRR = Math.pow(investorExitValue / tokTotalInvested, 1 / exitHorizon) - 1;

        // Liquidity Premium / Efficiency
        // Tokenized assets often command a liquidity premium or "uplift" in utility. 
        // We can interpret the IRR difference as the uplift.

        // Chart generation
        const charts = Array.from({ length: exitHorizon + 1 }, (_, i) => {
            const yearValuation = INITIAL_VALUATION * Math.pow(1 + growthRate, i);
            const yearEquityValue = yearValuation * equityFraction;
            return {
                year: i,
                traditionalValue: yearEquityValue, // Value is same, but cost basis was higher so net is worse
                tokenizedValue: yearEquityValue, // We could visually show the profit difference? 
                // Better: Show "Investor Value" as if both started at same basis but one drags? 
                // Or simply plot the Growth of Value. The "ROI" difference is in the metrics.
                // Let's plot Value.
                value: yearEquityValue,
            };
        });

        return {
            currentValuation: INITIAL_VALUATION,
            exitValuation,
            traditional: {
                investorCost: tradTotalInvested,
                exitValue: investorExitValue,
                netIRR: tradIRR,
                netProfit: investorExitValue - tradTotalInvested,
                issuanceCostAmount: tradCostAmount,
            },
            tokenized: {
                investorCost: tokTotalInvested,
                exitValue: investorExitValue,
                netIRR: tokIRR,
                netProfit: investorExitValue - tokTotalInvested,
                issuanceCostAmount: tokCostAmount,
                liquidityUplift: (tokIRR - tradIRR) * 100, // Percentage points
            },
            charts,
        };
    }, [params]);

    return { params, setParams, results };
};
