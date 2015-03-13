#include "DES.h"
#include <string.h>


static const uint8_t S1[] =
{
    14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
     0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
     4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0, 
    15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13 
};

static const uint8_t S2[] =
{
    15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
     3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
     0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
    13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9 
};

static const uint8_t S3[] = 
{
    10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
    13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
    13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
     1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12 
};

static const uint8_t S4[] =
{
     7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
    13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
    10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
     3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14 
};

static const uint8_t S5[] = 
{
     2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
    14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
     4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
    11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3 
};

static const uint8_t S6[] =
{
    12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
    10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
     9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
     4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13 
};

static const uint8_t S7[] =
{
     4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
    13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
     1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
     6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12 
};

static const uint8_t S8[] =
{
    13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
     1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
     7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
     2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11 
};

static void pc1(uint8_t *k, uint8_t *key)
{
    memset(k, 0, 7);
    for(int i = 0; i < 8; ++i)
    {
        k[0] = (k[0] << 1) | (key[i] & 0x01);
        k[1] = (k[1] << 1) | ((key[i] & 0x02) >> 1);
        k[2] = (k[2] << 1) | ((key[i] & 0x04) >> 2);
    }
    for(int i = 0 ; i < 4; ++i)
    {
        k[3] = (k[3] << 1) | ((key[4+i] & 0x40) >> 6);
        k[4] = (k[4] << 1) | ((key[4+i] & 0x20) >> 5);
        k[5] = (k[5] << 1) | ((key[4+i] & 0x10) >> 4);
        k[6] = (k[6] << 1) | ((key[i] & 0x08) >> 3);
    }
    for(int i = 0 ; i < 4; ++i)
    {
        k[3] = (k[3] << 1) | ((key[4+i] & 0x08) >> 3);
        k[4] = (k[4] << 1) | ((key[i] & 0x40) >> 6);
        k[5] = (k[5] << 1) | ((key[i] & 0x20) >> 5);
        k[6] = (k[6] << 1) | ((key[i] & 0x10) >> 4);
    }       
}

static void leftShift(uint8_t *k)
{
    uint8_t tmp = k[0] & 0x01, tmp2 = k[3] & 0x10;
    k[0] = (k[0] >> 1) | ((k[1] & 0x01) << 7);
    k[1] = (k[1] >> 1) | ((k[2] & 0x01) << 7);
    k[2] = (k[2] >> 1) | ((k[3] & 0x01) << 7);
    
    k[3] = ((k[3] & 0x0E) >> 1) | (tmp << 3) | ((k[3] & 0xE0) >> 1) | ((k[4] & 0x01) << 7);
    
    k[4] = (k[4] >> 1) | ((k[5] & 0x01) << 7);
    k[5] = (k[5] >> 1) | ((k[6] & 0x01) << 7);
    k[6] = (k[6] >> 1) | (tmp2 << 3);
        
}

void pc2(uint8_t *subKey, uint8_t *k)
{
    subKey[0] = ((k[1] & 0x20) >> 5) | ((k[2] & 0x01) << 1) | (k[1] & 0x04) | ((k[2] & 0x80) >> 4) | ((k[0] & 0x01) << 4) | ((k[0] & 0x10) << 1) | ((k[0] & 0x04) << 4) | ((k[3] & 0x08) << 4);
    subKey[1] = ((k[1] & 0x40) >> 6) | ((k[0] & 0x20) >> 4) | ((k[2] & 0x10) >> 2) | ((k[1] & 0x02) << 2) | ((k[2] & 0x40) >> 2) | ((k[2] & 0x04) << 3) | ((k[1] & 0x08) << 3) | ((k[0] & 0x08) << 4);
    subKey[2] = ((k[3] & 0x02) >> 1) | ((k[0] & 0x80) >> 6) | ((k[1] & 0x80) >> 5) | ((k[0] & 0x40) >> 3) | ((k[3] & 0x04) << 2) | ((k[2] & 0x08) << 2) | ((k[1] & 0x10) << 2) | ((k[0] & 0x02) << 6);
    subKey[3] = (k[5] & 0x01) | ((k[6] & 0x08) >> 2) | ((k[3] & 0x40) >> 4) | ((k[4] & 0x10) >> 1) | ((k[5] & 0x40) >> 2) | ((k[6] & 0x40) >> 1) | ((k[3] & 0x20) << 1) | (k[4] & 0x80);
    subKey[4] = ((k[6] & 0x04) >> 2) | ((k[5] & 0x10) >> 3) | ((k[4] & 0x01) << 2) | ((k[5] & 0x80) >> 4) | ((k[5] & 0x08) << 1) | ((k[6] & 0x01) << 5) | (k[4] & 0x40) | (k[6] & 0x80);
    subKey[5] = ((k[4] & 0x02) >> 1) | ((k[6] & 0x10) >> 3) | ((k[5] & 0x20) >> 3) | ((k[5] & 0x02) << 2) | ((k[6] & 0x02) << 3) | ((k[4] & 0x08) << 2) | ((k[3] & 0x10) << 2) | (k[3] & 0x80);
}


static void initialPermutation(uint8_t *in)
{
    uint8_t tmp[8];
    memcpy(tmp, in, 8);
    for(int i = 0; i < 8; ++i)
    {
        tmp[4] = (tmp[4] << 1) | (in[i] & 0x01);
        tmp[5] = (tmp[5] << 1) | ((in[i] & 0x04) >> 2);
        tmp[6] = (tmp[6] << 1) | ((in[i] & 0x10) >> 4);
        tmp[7] = (tmp[7] << 1) | ((in[i] & 0x40) >> 6);
        
        tmp[0] = (tmp[0] << 1) | ((in[i] & 0x02) >> 1);
        tmp[1] = (tmp[1] << 1) | ((in[i] & 0x08) >> 3);
        tmp[2] = (tmp[2] << 1) | ((in[i] & 0x20) >> 5);
        tmp[3] = (tmp[3] << 1) | ((in[i] & 0x80) >> 7); 
    }
    
    memcpy(in, tmp, 8);
}

static void invInitialPermutation(uint8_t *out)
{
    uint8_t tmp[8];
    memcpy(tmp, out , 8);
    for(int i = 3; i >= 0; --i)
    {
        out[0] = (out[0] << 2) | ((tmp[4+i] & 0x80) >> 7) | ((tmp[i] & 0x80) >> 6); 
        out[1] = (out[1] << 2) | ((tmp[4+i] & 0x40) >> 6) | ((tmp[i] & 0x40) >> 5);
        out[2] = (out[2] << 2) | ((tmp[4+i] & 0x20) >> 5) | ((tmp[i] & 0x20) >> 4);
        out[3] = (out[3] << 2) | ((tmp[4+i] & 0x10) >> 4) | ((tmp[i] & 0x10) >> 3);
        out[4] = (out[4] << 2) | ((tmp[4+i] & 0x08) >> 3) | ((tmp[i] & 0x08) >> 2);
        out[5] = (out[5] << 2) | ((tmp[4+i] & 0x04) >> 2) | ((tmp[i] & 0x04) >> 1);
        out[6] = (out[6] << 2) | ((tmp[4+i] & 0x02) >> 1) | (tmp[i] & 0x02);
        out[7] = (out[7] << 2) | (tmp[4+i] & 0x01)      | ((tmp[i] & 0x01) << 1);
    }
}

static void expand(uint8_t *e, uint8_t *r)
{
    
    e[0] = ((r[3] & 0x80) >> 7) | ((r[0] & 0x1F) << 1) | ((r[0] & 0x18) << 3);
    e[1] = ((r[0] & 0xE0) >> 5) | ((r[1] & 0x01) << 3) | ((r[0] & 0x80) >> 3) | ((r[1] & 0x07) << 5);
    e[2] = ((r[1] & 0x18) >> 3) | ((r[1] & 0xF8) >> 1) | ((r[2] & 0x01) << 7);                
    e[3] = ((r[1] & 0x80) >> 7) | ((r[2] & 0x1F) << 1) | ((r[2] & 0x18) << 3);
    e[4] = ((r[2] & 0xE0) >> 5) | ((r[3] & 0x01) << 3) | ((r[2] & 0x80) >> 3) | ((r[3] & 0x07) << 5);
    e[5] = ((r[3] & 0x18) >> 3) | ((r[3] & 0xF8) >> 1) | ((r[0] & 0x01) << 7);
    
}

static void permutation(uint8_t *r)
{
    uint8_t buffer[4];
    
    buffer[0] = ((r[1] & 0x80) >> 7) | ((r[0] & 0x40) >> 5) | ((r[2] & 0x08) >> 1) | ((r[2] & 0x10) >> 1) | (r[3] & 0x10) | ((r[1] & 0x08) << 2) | ((r[3] & 0x08) << 3) | ((r[2] & 0x01) << 7);
    buffer[1] = (r[0] & 0x01) | ((r[1] & 0x40) >> 5) | ((r[2] & 0x40) >> 4) | ((r[3] & 0x02) << 2) | (r[0] & 0x10) | ((r[2] & 0x02) << 4) | (r[3] & 0x40) | ((r[1] & 0x02) << 6);
    buffer[2] = ((r[0] & 0x02) >> 1) | ((r[0] & 0x80) >> 6) | ((r[2] & 0x80) >> 5) | ((r[1] & 0x20) >> 2) | ((r[3] & 0x80) >> 3) | ((r[3] & 0x04) << 3) | ((r[0] & 0x04) << 4) | ((r[1] & 0x01) << 7);
    buffer[3] = ((r[2] & 0x04) >> 2) |  ((r[1] & 0x10) >> 3) | ((r[3] & 0x20) >> 3) | ((r[0] & 0x20) >> 2) | ((r[2] & 0x20) >> 1) | ((r[1] & 0x04) << 3) | ((r[0] & 0x08) << 3) | ((r[3] & 0x01) << 7);
    
    memcpy(r, buffer,4);
}

static void substitute(uint8_t *r, uint8_t *e)
{
    int index = ((e[0] & 0x01) << 5) | ((e[0] & 0x02) << 2) | (e[0] & 0x04)  | ((e[0] & 0x08) >> 2) | ((e[0] & 0x10) >> 4) | ((e[0] & 0x20) >> 1);
    int index2 = ((e[0] & 0x40) >> 1) | ((e[0] & 0x80) >> 4) | ((e[1] & 0x01) << 2) | (e[1] & 0x02) | ((e[1] & 0x04) >> 2) | ((e[1] & 0x08) << 1);  
    r[0] = ((S2[index2] & 0x08) >> 3) | ((S2[index2] & 0x04) >> 1) | ((S2[index2] & 0x02) << 1) | ((S2[index2] & 0x01) << 3);
    r[0] <<= 4;
    r[0] |= ((S1[index] & 0x08) >> 3) | ((S1[index] & 0x04) >> 1) | ((S1[index] & 0x02) << 1) | ((S1[index] & 0x01) << 3);


    index = ((e[1] & 0x10) << 1) | ((e[1] & 0x20) >> 2) | ((e[1] & 0x40) >> 4) | ((e[1] & 0x80) >> 6) | (e[2] & 0x01) | ((e[2] & 0x02) << 3);
    index2 = ((e[2] & 0x04) << 3) | (e[2] & 0x08) | ((e[2] & 0x10) >> 2) | ((e[2] & 0x20) >> 4) | ((e[2] & 0x40) >> 6) | ((e[2] & 0x80) >> 3);


    r[1] = ((S4[index2] & 0x08) >> 3) | ((S4[index2] & 0x04) >> 1) | ((S4[index2] & 0x02) << 1) | ((S4[index2] & 0x01) << 3);
    r[1] <<= 4;
    r[1] |= ((S3[index] & 0x08) >> 3) | ((S3[index] & 0x04) >> 1) | ((S3[index] & 0x02) << 1) | ((S3[index] & 0x01) << 3);
    
    
    index = ((e[3] & 0x01) << 5) | ((e[3] & 0x02) << 2) | (e[3] & 0x04)  | ((e[3] & 0x08) >> 2) | ((e[3] & 0x10) >> 4) | ((e[3] & 0x20) >> 1);
    index2 = ((e[3] & 0x40) >> 1) | ((e[3] & 0x80) >> 4) | ((e[4] & 0x01) << 2) | (e[4] & 0x02) | ((e[4] & 0x04) >> 2) | ((e[4] & 0x08) << 1);  
    r[2] = ((S6[index2] & 0x08) >> 3) | ((S6[index2] & 0x04) >> 1) | ((S6[index2] & 0x02) << 1) | ((S6[index2] & 0x01) << 3);
    r[2] <<= 4;
    r[2] |= ((S5[index] & 0x08) >> 3) | ((S5[index] & 0x04) >> 1) | ((S5[index] & 0x02) << 1) | ((S5[index] & 0x01) << 3);


    index = ((e[4] & 0x10) << 1) | ((e[4] & 0x20) >> 2) | ((e[4] & 0x40) >> 4) | ((e[4] & 0x80) >> 6) | (e[5] & 0x01) | ((e[5] & 0x02) << 3);
    index2 = ((e[5] & 0x04) << 3) | (e[5] & 0x08) | ((e[5] & 0x10) >> 2) | ((e[5] & 0x20) >> 4) | ((e[5] & 0x40) >> 6) | ((e[5] & 0x80) >> 3);

    r[3] = ((S8[index2] & 0x08) >> 3) | ((S8[index2] & 0x04) >> 1) | ((S8[index2] & 0x02) << 1) | ((S8[index2] & 0x01) << 3);
    r[3] <<= 4;
    r[3] |= ((S7[index] & 0x08) >> 3) | ((S7[index] & 0x04) >> 1) | ((S7[index] & 0x02) << 1) | ((S7[index] & 0x01) << 3);
}


DES::DES(uint8_t *key):
BlockCipher(8,ECB_MODE)
{
    generateSubKeys(key);
}

DES::DES(uint8_t *key, uint8_t *iv):
BlockCipher(8,CBC_MODE, iv)
{
    generateSubKeys(key);
}

void DES::generateSubKeys(uint8_t *key)
{

    for(int i = 0; i < 8; ++i)
        key[i] = ((key[i] & 0x01) << 7) | ((key[i] & 0x02) << 5) | ((key[i] & 0x04) << 3) | ((key[i] & 0x08) << 1)  | ((key[i] & 0x10) >> 1) | ((key[i] & 0x20) >> 3) | ((key[i] & 0x40) >> 5) | ((key[i] & 0x80) >> 7);
    
    uint8_t workingKey[7];
    pc1(workingKey, key);
    
    for(int i = 1; i <= 16; ++i)
    {
        leftShift(workingKey);
        if(i != 9 && i >= 3 && i <=15)
            leftShift(workingKey);
        pc2(subKeys[i-1], workingKey);
    }   
}

void DES::encryptBlock(uint8_t *out, uint8_t *in)
{
    uint8_t tmp[8];
    memcpy(tmp, in, 8);
    for(int i = 0; i < 8; ++i)
        tmp[i] = ((tmp[i] & 0x01) << 7) | ((tmp[i] & 0x02) << 5) | ((tmp[i] & 0x04) << 3) | ((tmp[i] & 0x08) << 1)  | ((tmp[i] & 0x10) >> 1) | ((tmp[i] & 0x20) >> 3) | ((tmp[i] & 0x40) >> 5) | ((tmp[i] & 0x80) >> 7);


    uint8_t l[4], r[4], tmpR[4], e[6];
    initialPermutation(tmp);
    memcpy(l, tmp, 4);
    memcpy(r, &tmp[4], 4);
    for(int i = 0; i < 16; ++i)
    {
        memcpy(tmpR, r, 4);
        expand(e, r);
        for(int j = 0; j < 6; ++j)
            e[j] ^= subKeys[i][j];
        substitute(r,e);
        permutation(r);
        for(int j = 0; j < 4; ++j)
            r[j] ^= l[j];
        
        memcpy(l, tmpR, 4);

    }
    memcpy(tmp, r, 4);
    memcpy(&tmp[4], l, 4);
    
    invInitialPermutation(tmp);
    
    for(int i = 0; i < 8; ++i)
    {
        out[i] = ((tmp[i] & 0x01) << 3) | ((tmp[i] & 0x02) << 1) | ((tmp[i] & 0x04) >> 1) | ((tmp[i] & 0x08) >> 3);
        out[i] <<= 4;
        tmp[i] >>= 4;
        out[i] |= ((tmp[i] & 0x01) << 3) | ((tmp[i] & 0x02) << 1) | ((tmp[i] & 0x04) >> 1) | ((tmp[i] & 0x08) >> 3);
    }
}


void DES::decryptBlock(uint8_t *out, uint8_t *in)
{
    uint8_t tmp[8];
    memcpy(tmp, in, 8);
    for(int i = 0; i < 8; ++i)
        tmp[i] = ((tmp[i] & 0x01) << 7) | ((tmp[i] & 0x02) << 5) | ((tmp[i] & 0x04) << 3) | ((tmp[i] & 0x08) << 1)  | ((tmp[i] & 0x10) >> 1) | ((tmp[i] & 0x20) >> 3) | ((tmp[i] & 0x40) >> 5) | ((tmp[i] & 0x80) >> 7);
    
    uint8_t l[4], r[4], tmpL[4], e[6];
    initialPermutation(tmp);
    memcpy(l, tmp, 4);
    memcpy(r, &tmp[4], 4);
    
    for(int i = 15; i >= 0; --i)
    {
        memcpy(tmpL, r, 4);
        expand(e, r);
        for(int j = 0; j < 6; ++j)
            e[j] ^= subKeys[i][j];
        substitute(r,e);
        permutation(r);
        for(int j = 0; j < 4; ++j)
            r[j] ^= l[j];
        
        memcpy(l, tmpL, 4);
    }
    
    memcpy(&tmp[4], l, 4);
    memcpy(tmp, r, 4); 
    invInitialPermutation(tmp);
    

    for(int i = 0; i < 8; ++i)
    {
        out[i] = ((tmp[i] & 0x01) << 3) | ((tmp[i] & 0x02) << 1) | ((tmp[i] & 0x04) >> 1) | ((tmp[i] & 0x08) >> 3);
        out[i] <<= 4;
        tmp[i] >>= 4;
        out[i] |= ((tmp[i] & 0x01) << 3) | ((tmp[i] & 0x02) << 1) | ((tmp[i] & 0x04) >> 1) | ((tmp[i] & 0x08) >> 3);
    }
}
