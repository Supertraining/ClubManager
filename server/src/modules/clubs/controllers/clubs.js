import { clubRpc } from '../DAO/clubs.js';
import { joinClub, publicClub, saveSettings } from '../services/clubs.js';

export function getClub(req, res) {
  res.json(publicClub(req.club));
}

export async function updateSettings(req, res, next) {
  try {
    res.json(await saveSettings(req.club.id, req.body, req.accessToken));
  } catch (error) {
    next(error);
  }
}

export async function join(req, res, next) {
  try {
    res.json(await joinClub(req.club.id, req.accessToken));
  } catch (error) {
    next(error);
  }
}

export async function invite(req, res, next) {
  try {
    await clubRpc(req.accessToken, 'invite_club_member', { p_club_id: req.club.id, p_email: req.body.email });
    res.status(202).json({ accepted: true });
  } catch (error) {
    next(error);
  }
}
