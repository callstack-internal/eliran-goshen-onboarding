import { Model } from "@nozbe/watermelondb"
import { field, date } from "@nozbe/watermelondb/decorators"

export default class City extends Model {
  static table = "cities"

  @field("city") city!: string
  @date("created_at") createdAt!: number
  @date("updated_at") updatedAt!: number
}
