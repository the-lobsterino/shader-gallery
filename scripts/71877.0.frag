#ifdef GL_ES
precision mediump float;
#endif
vec2 A(vec2 a,vec2 b) { return a+b; }
vec2 B(vec2 a,vec2 b) { return a-b; }
vec2 C(vec2 a,vec2 b) { return a*mat2(b.x,-b.y,b.y,b.x); }
vec2 D(vec2 a,vec2 b) {
  float e, f;
  vec2 g = vec2(1,-1);
  if( abs(b.x) >= abs(b.y) ) {
    e = b.y / b.x;
    f = b.x + b.y * e;
    g.y = -e;
  } else {
    e = b.x / b.y;
    f = b.x * e + b.y;
    g.x = e;
  }
  return C(a,g) / f;
}
vec4 A(vec4 a,vec4 b) { return a+b; }
vec4 B(vec4 a,vec4 b) { return a-b; }
vec4 C(vec4 a,vec4 b) { return vec4(C(a.xy,b.xy),A(C(a.xy,b.zw),C(a.zw,b.xy))); }
vec4 D(vec4 a,vec4 b) { return vec4(D(a.xy,b.xy),D(B(C(a.zw,b.xy),C(a.xy,b.zw)),C(b.xy,b.xy))); }
vec4 AA(vec4 a,vec4 b) { return a+b; }
vec4 BB(vec4 a,vec4 b) { return a-b; }
vec4 CC(vec4 a,vec4 b) { return vec4(a.x*b.x-dot(a.yzw,b.yzw),b.yzw*a.x+a.yzw*b.x+cross(a.yzw,b.yzw)); }
vec4 DD(vec4 a,vec4 b) { b.x=-b.x; b=-b/dot(b,b); return vec4(a.x*b.x-dot(a.yzw,b.yzw),b.yzw*a.x+a.yzw*b.x+cross(a.yzw,b.yzw)); }
#if __VERSION__ >= 400
dvec2 A(dvec2 a,dvec2 b) { return a+b; }
dvec2 B(dvec2 a,dvec2 b) { return a-b; }
dvec2 C(dvec2 a,dvec2 b) { return a*dmat2(b.x,-b.y,b.y,b.x); }
dvec2 D(dvec2 a,dvec2 b) {
  double e, f;
  dvec2 g = dvec2(1,-1);
  if( abs(b.x) >= abs(b.y) ) {
    e = b.y / b.x;
    f = b.x + b.y * e;
    g.y = -e;
  } else {
    e = b.x / b.y;
    f = b.x * e + b.y;
    g.x = e;
  }
  return C(a,g) / f;
}
dvec4 A(dvec4 a,dvec4 b) { return a+b; }
dvec4 B(dvec4 a,dvec4 b) { return a-b; }
dvec4 C(dvec4 a,dvec4 b) { return dvec4(C(a.xy,b.xy),A(C(a.xy,b.zw),C(a.zw,b.xy))); }
dvec4 D(dvec4 a,dvec4 b) { return dvec4(D(a.xy,b.xy),D(B(C(a.zw,b.xy),C(a.xy,b.zw)),C(b.xy,b.xy))); }
dvec4 AA(dvec4 a,dvec4 b) { return a+b; }
dvec4 BB(dvec4 a,dvec4 b) { return a-b; }
dvec4 CC(dvec4 a,dvec4 b) { return dvec4(a.x*b.x-dot(a.yzw,b.yzw),b.yzw*a.x+a.yzw*b.x+cross(a.yzw,b.yzw)); }
dvec4 DD(dvec4 a,dvec4 b) { b.x=-b.x; b=-b/dot(b,b); return dvec4(a.x*b.x-dot(a.yzw,b.yzw),b.yzw*a.x+a.yzw*b.x+cross(a.yzw,b.yzw)); }
#endif
#if 0
#define N 3
vec2 f(vec2 z,vec2 a[N],vec2 b[N],int i) {
  vec2 a0,b0;
  for (int j=0;j<i;j++) {
    a0=vec2(0);
    b0=vec2(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,z),a[k]);
      b0=A(C(b0,z),b[k]);
    }
    z=D(a0,b0);
  }
  return z;
}
vec4 f(vec4 z,vec4 a[N],vec4 b[N],int i) {
  vec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=vec4(0);
    b0=vec4(0);
    for (int k=0;k<N;k++) {
      a0=AA(CC(a0,z),a[k]);
      b0=AA(CC(b0,z),b[k]);
    }
    z=DD(a0,b0);
  }
  return z;
}
vec4 g(vec4 z,vec4 a[N],vec4 b[N],int i) {
  vec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=vec4(0);
    b0=vec4(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,z),a[k]);
      b0=A(C(b0,z),b[k]);
    }
    z=D(a0,b0);
  }
  return z;
}
vec2 g(vec2 z,vec4 a[N],vec4 b[N],int i) {
  vec4 Z=vec4(z,1,0);
  vec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=vec4(0);
    b0=vec4(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,Z),a[k]);
      b0=A(C(b0,Z),b[k]);
    }
    Z=D(a0,b0);
  }
  return D(Z.xy,Z.zw);
}
#if __VERSION__ >= 400
dvec2 f(dvec2 z,dvec2 a[N],dvec2 b[N],int i) {
  dvec2 a0,b0;
  for (int j=0;j<i;j++) {
    a0=dvec2(0);
    b0=dvec2(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,z),a[k]);
      b0=A(C(b0,z),b[k]);
    }
    z=D(a0,b0);
  }
  return z;
}
dvec4 f(dvec4 z,dvec4 a[N],dvec4 b[N],int i) {
  dvec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=dvec4(0);
    b0=dvec4(0);
    for (int k=0;k<N;k++) {
      a0=AA(CC(a0,z),a[k]);
      b0=AA(CC(b0,z),b[k]);
    }
    z=DD(a0,b0);
  }
  return z;
}
dvec4 g(dvec4 z,dvec4 a[N],dvec4 b[N],int i) {
  dvec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=dvec4(0);
    b0=dvec4(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,z),a[k]);
      b0=A(C(b0,z),b[k]);
    }
    z=D(a0,b0);
  }
  return z;
}
dvec2 g(dvec2 z,dvec4 a[N],dvec4 b[N],int i) {
  dvec4 Z=dvec4(z,1,0);
  dvec4 a0,b0;
  for (int j=0;j<i;j++) {
    a0=dvec4(0);
    b0=dvec4(0);
    for (int k=0;k<N;k++) {
      a0=A(C(a0,Z),a[k]);
      b0=A(C(b0,Z),b[k]);
    }
    Z=D(a0,b0);
  }
  return D(Z.xy,Z.zw);
}
#endif
#undef N
#endif
#if 0
uint murmurHash11(uint src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
float hash11(float src) {
    uint h = murmurHash11(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uint murmurHash12(uvec2 src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
float hash12(vec2 src) {
    uint h = murmurHash12(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uint murmurHash13(uvec3 src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
float hash13(vec3 src) {
    uint h = murmurHash13(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uint murmurHash14(uvec4 src) {
    const uint M = 0x5bd1e995u;
    uint h = 1190494759u;
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z; h *= M; h ^= src.w;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
float hash14(vec4 src) {
    uint h = murmurHash14(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec2 murmurHash21(uint src) {
    const uint M = 0x5bd1e995u;
    uvec2 h = uvec2(1190494759u, 2147483647u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec2 hash21(float src) {
    uvec2 h = murmurHash21(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec2 murmurHash22(uvec2 src) {
    const uint M = 0x5bd1e995u;
    uvec2 h = uvec2(1190494759u, 2147483647u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec2 hash22(vec2 src) {
    uvec2 h = murmurHash22(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec2 murmurHash23(uvec3 src) {
    const uint M = 0x5bd1e995u;
    uvec2 h = uvec2(1190494759u, 2147483647u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec2 hash23(vec3 src) {
    uvec2 h = murmurHash23(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec2 murmurHash24(uvec4 src) {
    const uint M = 0x5bd1e995u;
    uvec2 h = uvec2(1190494759u, 2147483647u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z; h *= M; h ^= src.w;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec2 hash24(vec4 src) {
    uvec2 h = murmurHash24(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec3 murmurHash31(uint src) {
    const uint M = 0x5bd1e995u;
    uvec3 h = uvec3(1190494759u, 2147483647u, 3559788179u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec3 hash31(float src) {
    uvec3 h = murmurHash31(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec3 murmurHash32(uvec2 src) {
    const uint M = 0x5bd1e995u;
    uvec3 h = uvec3(1190494759u, 2147483647u, 3559788179u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec3 hash32(vec2 src) {
    uvec3 h = murmurHash32(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec3 murmurHash33(uvec3 src) {
    const uint M = 0x5bd1e995u;
    uvec3 h = uvec3(1190494759u, 2147483647u, 3559788179u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec3 hash33(vec3 src) {
    uvec3 h = murmurHash33(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec3 murmurHash34(uvec4 src) {
    const uint M = 0x5bd1e995u;
    uvec3 h = uvec3(1190494759u, 2147483647u, 3559788179u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z; h *= M; h ^= src.w;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec3 hash34(vec4 src) {
    uvec3 h = murmurHash34(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec4 murmurHash41(uint src) {
    const uint M = 0x5bd1e995u;
    uvec4 h = uvec4(1190494759u, 2147483647u, 3559788179u, 4091524673u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec4 hash41(float src) {
    uvec4 h = murmurHash41(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec4 murmurHash42(uvec2 src) {
    const uint M = 0x5bd1e995u;
    uvec4 h = uvec4(1190494759u, 2147483647u, 3559788179u, 4091524673u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec4 hash42(vec2 src) {
    uvec4 h = murmurHash42(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec4 murmurHash43(uvec3 src) {
    const uint M = 0x5bd1e995u;
    uvec4 h = uvec4(1190494759u, 2147483647u, 3559788179u, 4091524673u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec4 hash43(vec3 src) {
    uvec4 h = murmurHash43(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
uvec4 murmurHash44(uvec4 src) {
    const uint M = 0x5bd1e995u;
    uvec4 h = uvec4(1190494759u, 2147483647u, 3559788179u, 4091524673u);
    src *= M; src ^= src>>24u; src *= M;
    h *= M; h ^= src.x; h *= M; h ^= src.y; h *= M; h ^= src.z; h *= M; h ^= src.w;
    h ^= h>>13u; h *= M; h ^= h>>15u;
    return h;
}
vec4 hash44(vec4 src) {
    uvec4 h = murmurHash44(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}
#endif
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}