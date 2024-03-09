import { Album } from "./album.entity";
import { Artist } from "./artist.entity";
import { Track } from "./track.entity";

export type Favs = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};