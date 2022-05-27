import * as React from "react";
import { Box, Button, Divider, Grid, Typography, Link } from "@mui/material";

import { useInput } from "@/hooks/useInput";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useEffect, useState } from "react";
import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";
import { truncateAddress } from "@/utils";
import { SymbioticProtocol } from "@celo-progressive-dapp-starter/hardhat/types/SymbioticProtocol";

export function SymbioticProtocolContract({ contractData }) {
  const { kit, address, network, performActions } = useContractKit();
  const [nonProfits, setNonProfits] = useState<string[]>([]);
  const [greeterInput, setGreeterInput] = useInput({ type: "text" });
  const [contractLink, setContractLink] = useState<string>("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const contract = contractData
    ? (new kit.web3.eth.Contract(
        contractData.abi,
        contractData.address
      ) as any as SymbioticProtocol)
    : null;

  useEffect(() => {
    if (contractData) {
      setContractLink(`${network.explorer}/address/${contractData.address}`);
    }
  }, [network, contractData]);

  const donate = async () => {
    // TODO: these values should be set by frontend selectors 
    const roleId = 0;
    const value = 100; 
    try {
      await performActions(async (kit) => {
        const gasLimit = await contract.methods
          .donate(roleId, value)
          .estimateGas();

        const result = await contract.methods
          .donate(roleId, value)
          //@ts-ignore
          .send({ from: address, gasLimit });

        console.log(result);

        const variant = result.status == true ? "success" : "error";
        const url = `${network.explorer}/tx/${result.transactionHash}`;
        const action: SnackbarAction = (key) => (
          <>
            <Link href={url} target="_blank">
              View in Explorer
            </Link>
            <Button
              onClick={() => {
                closeSnackbar(key);
              }}
            >
              X
            </Button>
          </>
        );
        enqueueSnackbar("Transaction processed", {
          variant,
          action,
        });
      });
    } catch (e) {
      enqueueSnackbar(e.message, {variant: 'error'});
      console.log(e);
    }
  };

  const getNonProfits = async () => {
    try {
      const result = await contract.methods.getNonProfits().call();
      setNonProfits(result.map((nonProfit) => nonProfit[0]));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>
        <Typography variant="h5">Greeter Contract:</Typography>
        {contractData ? (
          <Link href={contractLink} target="_blank">
            {truncateAddress(contractData?.address)}
          </Link>
        ) : (
          <Typography>No contract detected for {network.name}</Typography>
        )}
        <Divider sx={{ m: 1 }} />

        <Typography variant="h6">Read Contract</Typography>
        <Typography sx={{ m: 1, marginLeft: 0, wordWrap: "break-word" }}>
          Non Profits: {nonProfits}
        </Typography>
        <Button sx={{ m: 1, marginLeft: 0 }} variant="contained" onClick={donate}>
          Donate
        </Button>
      </Grid>
    </Grid>
  );
}
