import { JSONSerializable } from '../../util/json';
import { BaseVestingAccount } from './BaseVestingAccount';
import Long from 'long';
import { PublicKey } from '../PublicKey';

import { BaseVestingAccount as BaseVestingAccount_pb } from '@initia/initia.proto/cosmos/vesting/v1beta1/vesting';
import { ContinuousVestingAccount as ContinuousVestingAccount_pb } from '@initia/initia.proto/cosmos/vesting/v1beta1/vesting';
import { Any } from '@initia/initia.proto/google/protobuf/any';

/**
 * ContinuousVestingAccount implements the VestingAccount interface. It
 * continuously vests by unlocking coins linearly with respect to time.
 */
export class ContinuousVestingAccount extends JSONSerializable<
  ContinuousVestingAccount.Amino,
  ContinuousVestingAccount.Data,
  ContinuousVestingAccount.Proto
> {
  /**
   *
   * @param base_vesting_account account information
   * @param start_time vesting start time
   */
  constructor(
    public base_vesting_account: BaseVestingAccount,
    public start_time: number
  ) {
    super();
  }

  public getAccountNumber(): number {
    return this.base_vesting_account.getAccountNumber();
  }

  public getSequenceNumber(): number {
    return this.base_vesting_account.getSequenceNumber();
  }

  public getPublicKey(): PublicKey | null {
    return this.base_vesting_account.base_account.public_key;
  }

  public toAmino(): ContinuousVestingAccount.Amino {
    const { base_vesting_account, start_time } = this;
    return {
      type: 'cosmos-sdk/ContinuousVestingAccount',
      value: {
        base_vesting_account: base_vesting_account.toAmino().value,
        start_time: start_time.toFixed(),
      },
    };
  }

  public static fromAmino(data: ContinuousVestingAccount.Amino): ContinuousVestingAccount {
    const base_vesting_account = BaseVestingAccount.fromAmino({
      type: 'cosmos-sdk/BaseVestingAccount',
      value: data.value.base_vesting_account,
    });
    return new ContinuousVestingAccount(
      base_vesting_account,
      Number.parseInt(data.value.start_time)
    );
  }

  public toData(): ContinuousVestingAccount.Data {
    const { base_vesting_account, start_time } = this;
    return {
      '@type': '/cosmos.vesting.v1beta1.ContinuousVestingAccount',
      base_vesting_account: base_vesting_account.toData(),
      start_time: start_time.toFixed(),
    };
  }

  public static fromData(data: ContinuousVestingAccount.Data): ContinuousVestingAccount {
    const base_vesting_account = BaseVestingAccount.fromData({
      '@type': '/cosmos.vesting.v1beta1.BaseVestingAccount',
      ...data.base_vesting_account,
    });

    return new ContinuousVestingAccount(
      base_vesting_account,
      Number.parseInt(data.start_time)
    );
  }

  public toProto(): ContinuousVestingAccount.Proto {
    const { base_vesting_account, start_time } = this;

    return ContinuousVestingAccount_pb.fromPartial({
      baseVestingAccount: base_vesting_account.toProto(),
      startTime: Long.fromNumber(start_time),
    });
  }

  public static fromProto(
    ContinuousVestingAccountProto: ContinuousVestingAccount.Proto): ContinuousVestingAccount {
    const baseVestingAccount = BaseVestingAccount.fromProto(
      ContinuousVestingAccountProto.baseVestingAccount as BaseVestingAccount_pb
    );

    return new ContinuousVestingAccount(
      baseVestingAccount,
      ContinuousVestingAccountProto.startTime.toNumber()
    );
  }

  public packAny(): Any {
    return Any.fromPartial({
      typeUrl: '/cosmos.vesting.v1beta1.ContinuousVestingAccount',
      value: ContinuousVestingAccount_pb.encode(this.toProto()).finish(),
    });
  }

  public static unpackAny(pubkeyAny: Any): ContinuousVestingAccount {
    return ContinuousVestingAccount.fromProto(ContinuousVestingAccount_pb.decode(pubkeyAny.value));
  }
}

export namespace ContinuousVestingAccount {
  export interface Amino {
    type: 'cosmos-sdk/ContinuousVestingAccount';
    value: {
      base_vesting_account: BaseVestingAccount.AminoValue;
      start_time: string;
    };
  }

  export interface Data {
    '@type': '/cosmos.vesting.v1beta1.ContinuousVestingAccount';
    base_vesting_account: BaseVestingAccount.DataValue;
    start_time: string;
  }

  export type Proto = ContinuousVestingAccount_pb;
}