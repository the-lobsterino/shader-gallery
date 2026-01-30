precision mediump float;

uniform sampler2D u_Sampler;
uniform vec2 u_MaskSize;
uniform int u_MaskOffset;
uniform vec2 u_TextureSize;
uniform vec4 u_FillColour;
uniform vec4 u_BackgroundColour;
uniform vec4 u_BorderColour;
uniform vec2 u_BorderSize;

varying vec2 v_TexCoord;

float round(float a) {
  return floor(a + 0.5);
}

/**
 * Looks up and unpacks the position within bitset image.
 * Retuns true if the bit is set.
 */
bool LookupBit(vec2 maskPos) {  
  ivec2 iMaskPos = ivec2(maskPos);

  if(iMaskPos.x >= 0 && iMaskPos.y >= 0 && 
    iMaskPos.x < int(u_MaskSize.x) && iMaskPos.y < int(u_MaskSize.y)) {  
      // Compute the packed 32-bit index of the current mask bit position.
      int iMask = u_MaskOffset + iMaskPos.y * int(u_MaskSize.x) + iMaskPos.x;

      // Compute which component of the 32-bit (8-bit per channel) vec4.
      int iChannel = int(fract(float(iMask) / 32.0) * 4.0);
      // Compute which bit of the 8-bit component to extract.
      int iRShift = int(fract(float(iMask) /  8.0) * 8.0);
    
      // Compute the position within the input texture.
      // Int32 arithmetic here to avoid any precision issues.
      int iTexture = iMask / 32;
      int textureY = iTexture / int(u_TextureSize.x);
      int textureX = iTexture - textureY * int(u_TextureSize.x);
    
      // Load the packed texel.
      vec4 vPacked = texture2D(u_Sampler, vec2(float(textureX) + 0.5, float(textureY) + 0.5) / u_TextureSize);
    
      // Extact the packed (8-bit) channel within the packed (32-bit) vec4 and un-normalized from colour space.

      float packedChannel = 0.0;
    
      if(iChannel == 0) {
        packedChannel = round(vPacked[0] * 255.0);
      } else if(iChannel == 1) {
        packedChannel = round(vPacked[1] * 255.0);
      } else if(iChannel == 2) {
        packedChannel = round(vPacked[2] * 255.0);
      } else if(iChannel == 3) {
        packedChannel = round(vPacked[3] * 255.0);
      }
    
      // Unpack the mask bit from the 8-bit packed channel
      // Equivalent to: (packedChannel >> iRShift) & 1
       float unpackedBit = mod(floor(packedChannel / pow(2.0, float(iRShift))), 2.0);

      // Set the output depending on the mask bit value.
       return unpackedBit > 0.5;
  } else {
    return false;
  }
}

void main(void) {
  // Compute the masked bit un-normalized postion.
  vec2 maskPos = v_TexCoord * u_MaskSize;

  // Lookup all 9 touching neighbours.

  bool n00 = LookupBit(maskPos + vec2(-u_BorderSize.x, -u_BorderSize.y));
  bool n10 = LookupBit(maskPos + vec2(0.0, -u_BorderSize.y));
  bool n20 = LookupBit(maskPos + vec2(u_BorderSize.x, -u_BorderSize.y));

  bool n01 = LookupBit(maskPos + vec2(-u_BorderSize.x, 0.0));
  bool n11 = LookupBit(maskPos + vec2(0.0, 0.0));
  bool n21 = LookupBit(maskPos + vec2(u_BorderSize.x, 0.0));

  bool n02 = LookupBit(maskPos + vec2(-u_BorderSize.x, u_BorderSize.y));
  bool n12 = LookupBit(maskPos + vec2(0.0, u_BorderSize.y));
  bool n22 = LookupBit(maskPos + vec2(u_BorderSize.x, u_BorderSize.y));

  bool hitNeighborhood = n00 || n10 || n20 || n01 || n21 || n02 || n12 || n22;
  bool hitExtact = n11;

  // If the center of the neighborhood is inside the mask the frag shall be "u_FillColour".
  // Otherwise, if any of the surounding neighbours are inside the mask the frag shall be "u_BorderColour".
  // Lastly, if nothing hit then the frag shall be "u_BackgroundColour".
  gl_FragColor = hitExtact ? u_FillColour : hitNeighborhood ? u_BorderColour : u_BackgroundColour;
}

