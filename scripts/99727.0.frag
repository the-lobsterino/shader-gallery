vec4 GetPositionWS(in uint id) {
  vec4 pos;

#if SPARKLE_USE_SOA_LAYOUT
  pos = positions[id];
#else
  pos = particles[id].position;
#endif

  return vec4(pos.xyz, 1.0f);
}

// ----------------------------------------------------------------------------

layout(local_size_x = PARTICLES_KERNEL_GROUP_WIDTH) in;
void main() {
  const uint tid = gl_GlobalInvocationID.x;

  // Transform a particle's position from world space to view space.
  vec4 positionVS = uViewMatrix * GetPositionWS(tid);

  // The default front of camera in view space.
  const vec3 targetVS = vec3(0.0f, 0.0f, -1.0f);

  // Distance of the particle from the camera.
  dp[tid] = dot(targetVS, positionVS.xyz);
}